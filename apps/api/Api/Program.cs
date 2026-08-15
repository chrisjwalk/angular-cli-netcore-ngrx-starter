using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// In production the JWT signing key lives in an environment variable.
// Override config so that all consumers (JWT options + TokenService) read from a single path.
if (!builder.Environment.IsDevelopment())
{
  var envJwtKey = Environment.GetEnvironmentVariable("JWT_KEY");
  if (!string.IsNullOrEmpty(envJwtKey))
    builder.Configuration["Jwt:Key"] = envJwtKey;
}

// Fail fast: refuse to start if any required config is absent.
// This surfaces missing env vars immediately in logs rather than as
// cryptic 500s at runtime.
var requiredConfig = new[] { "Jwt:Key", "Jwt:Issuer", "Jwt:Audience" };
var missingConfig = requiredConfig
  .Where(key => string.IsNullOrEmpty(builder.Configuration[key]))
  .ToList();
if (missingConfig.Count > 0)
  throw new InvalidOperationException(
    $"Required configuration values are missing: {string.Join(", ", missingConfig)}. " +
    "Set them as environment variables (e.g. JWT_KEY, Jwt__Issuer, Jwt__Audience) before starting the application."
  );

builder.Services
  .AddAuthentication(options =>
  {
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
  })
  .AddJwtBearer(options =>
  {
    options.TokenValidationParameters = new TokenValidationParameters
    {
      ValidateIssuer = true,
      ValidIssuer = builder.Configuration["Jwt:Issuer"],
      ValidateAudience = true,
      ValidAudience = builder.Configuration["Jwt:Audience"],
      ValidateLifetime = true,
      ValidateIssuerSigningKey = true,
      IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
      ClockSkew = TimeSpan.Zero,
    };
  });

builder.Services.AddAuthorizationBuilder();

// USE_SQLITE=true runs the API against a local SQLite database instead of Azure
// SQL — used by the Playwright e2e suite and offline development. SQL Server
// migrations are provider-specific, so this path uses EnsureCreated (see below).
var useSqlite = string.Equals(
  Environment.GetEnvironmentVariable("USE_SQLITE"),
  "true",
  StringComparison.OrdinalIgnoreCase
);

builder.Services.AddDbContext<AppDbContext>(options =>
{
  if (useSqlite)
  {
    options.UseSqlite($"DataSource={Path.Combine(Path.GetTempPath(), "nx-ng-net-core.sqlite.db")}");
  }
  else
  {
    options.UseSqlServer(
      builder.Environment.IsDevelopment()
        ? builder.Configuration.GetConnectionString("AZURE_SQL_CONNECTIONSTRING")
        : Environment.GetEnvironmentVariable("AZURE_SQL_CONNECTIONSTRING")
    );
  }
});

builder
  .Services.AddIdentityCore<AppUser>()
  .AddEntityFrameworkStores<AppDbContext>()
  .AddSignInManager()
  .AddApiEndpoints();

builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<TodoRepository>();

var connectionString = builder.Environment.IsDevelopment()
  ? builder.Configuration.GetConnectionString("AZURE_SQL_CONNECTIONSTRING")
  : Environment.GetEnvironmentVariable("AZURE_SQL_CONNECTIONSTRING");

builder.Services.AddHealthChecks()
  .AddSqlServer(connectionString!, name: "sql", tags: ["ready"]);

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
  c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
});

builder.Services.AddControllers();

builder.Services.AddRateLimiter(options =>
{
  // Per-IP fixed window: max 10 account requests per minute.
  // Covers login, register, and password-reset to guard against brute force.
  options.AddPolicy("account", context =>
    RateLimitPartition.GetFixedWindowLimiter(
      context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
      _ => new FixedWindowRateLimiterOptions
      {
        Window = TimeSpan.FromMinutes(1),
        PermitLimit = 10,
        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
        QueueLimit = 0,
      }
    )
  );
  options.RejectionStatusCode = 429;
});

builder.Services.AddCors(options =>
  options.AddPolicy("SwaPreview", policy =>
    policy
      .SetIsOriginAllowed(origin =>
        Uri.TryCreate(origin, UriKind.Absolute, out var uri)
        && (uri.Host.EndsWith(".azurestaticapps.net")
            || (builder.Environment.IsDevelopment() && uri.Host == "localhost")))
      .AllowAnyMethod()
      .AllowAnyHeader()
      .AllowCredentials() // required for HttpOnly cookie exchange
  )
);

var app = builder.Build();

// Database setup at startup:
// - USE_SQLITE=true: create the schema with EnsureCreated (SQL Server migrations
//   are provider-specific) — used by the e2e suite and offline development.
// - Otherwise: apply EF migrations — always in Development (plus seed demo
//   todos), opt in elsewhere via the RUN_EF_MIGRATIONS=true app setting
//   (deploy.yml has no post-deploy execution context). Safe only for
//   single-instance deployments — use a migration job instead if scaling out.
//   In Development a migration failure is logged (not fatal) so the dev loop
//   survives an unreachable database; production fails fast.
var runMigrations = app.Environment.IsDevelopment()
  || string.Equals(
    Environment.GetEnvironmentVariable("RUN_EF_MIGRATIONS"),
    "true",
    StringComparison.OrdinalIgnoreCase
  );
if (useSqlite || runMigrations)
{
  using var scope = app.Services.CreateScope();
  var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
  try
  {
    if (useSqlite)
    {
      db.Database.EnsureCreated();
    }
    else
    {
      db.Database.Migrate();
    }
    if (app.Environment.IsDevelopment() && !db.Todos.Any())
    {
      db.Todos.AddRange(TodoSeeder.DemoTodos);
      db.SaveChanges();
    }
  }
  catch (Exception ex) when (app.Environment.IsDevelopment())
  {
    app.Logger.LogWarning(
      ex,
      "Database setup failed — API features will be unavailable until the database is reachable."
    );
  }
}

if (app.Environment.IsDevelopment())
{
  app.UseDeveloperExceptionPage();
}
else
{
  app.UseExceptionHandler("/Error");
  app.UseHsts();
  app.UseHttpsRedirection();
}

if (!app.Environment.IsDevelopment())
{
  PhysicalFileProvider fileProvider = new PhysicalFileProvider(
    Path.Combine(Directory.GetCurrentDirectory(), "apps", "web-app", "client")
  );
  FileExtensionContentTypeProvider contentTypeProvider = new FileExtensionContentTypeProvider();
  contentTypeProvider.Mappings[".webmanifest"] = "application/manifest+json";
  contentTypeProvider.Mappings[".md"] = "text/markdown";

  StaticFileOptions staticFileOptions = new StaticFileOptions()
  {
    ContentTypeProvider = contentTypeProvider,
    OnPrepareResponse = ctx =>
    {
      const int durationInSeconds = 60 * 60 * 24 * 365;
      ctx.Context.Response.Headers[HeaderNames.CacheControl] = "public,max-age=" + durationInSeconds;
    },
    FileProvider = fileProvider,
  };

  app.UseStaticFiles(staticFileOptions);
}

app.UseSwagger();

app.UseSwaggerUI(c =>
{
  c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
  c.RoutePrefix = "swagger";
});

app.UseRouting();

app.UseCors("SwaPreview");

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Liveness: app process is up — used by deploy smoke test.
app.MapHealthChecks("/health/live", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
  Predicate = _ => false, // exclude all tagged checks (e.g. SQL)
});

// Readiness: app + dependencies (DB) — used for monitoring.
app.MapHealthChecks("/health/ready");

// Custom JWT auth endpoints: login / refresh / logout
app.MapAuthEndpoints(app.Environment.IsDevelopment());

// Todo CRUD endpoints (EF Core-backed, paged/sorted/filtered)
app.MapTodoEndpoints();

// Keep Identity account-management endpoints (password reset, email confirmation, 2FA setup, etc.)
// Login and refresh from this group are superseded by /api/auth/* above.
app.MapGroup("/api/account")
  .MapIdentityApi<AppUser>()
  .RequireRateLimiting("account");

if (!app.Environment.IsDevelopment())
{
  // Serve index.html for any unmatched route (client-side routing fallback).
  // In development, Vite handles this instead.
  PhysicalFileProvider spaFileProvider = new PhysicalFileProvider(
    Path.Combine(Directory.GetCurrentDirectory(), "apps", "web-app", "client")
  );
  app.UseSpa(spa =>
  {
    spa.Options.DefaultPageStaticFileOptions = new StaticFileOptions()
    {
      FileProvider = spaFileProvider,
    };
  });
}

app.Run();
