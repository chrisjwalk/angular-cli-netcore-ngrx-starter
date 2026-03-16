using System;
using System.IO;
using System.Threading.RateLimiting;
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
using Microsoft.Net.Http.Headers;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication().AddBearerToken(IdentityConstants.BearerScheme, options =>
{
  options.BearerTokenExpiration = TimeSpan.FromHours(1);
  options.RefreshTokenExpiration = TimeSpan.FromDays(7);
});
builder.Services.AddAuthorizationBuilder();

builder.Services.AddDbContext<AppDbContext>(
  options =>
    options.UseSqlServer(
      builder.Environment.IsDevelopment()
        ? builder.Configuration.GetConnectionString("AZURE_SQL_CONNECTIONSTRING")
        : Environment.GetEnvironmentVariable("AZURE_SQL_CONNECTIONSTRING")
    )
);

builder
  .Services.AddIdentityCore<AppUser>()
  .AddEntityFrameworkStores<AppDbContext>()
  .AddApiEndpoints();

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
  )
);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
  app.UseDeveloperExceptionPage();
}
else
{
  app.UseExceptionHandler("/Error");
  app.UseHsts();
}

app.UseHttpsRedirection();

PhysicalFileProvider fileProvider = new PhysicalFileProvider(
  Path.Combine(Directory.GetCurrentDirectory(), "apps", "web-app", "browser")
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

app.UseSwagger();

app.UseSwaggerUI(c =>
{
  c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
  c.RoutePrefix = "swagger";
});

app.UseRouting();

app.UseCors("SwaPreview");

app.UseRateLimiter();

app.UseAuthorization();

app.MapControllers();

app.MapGroup("/api/account")
  .MapIdentityApi<AppUser>()
  .RequireRateLimiting("account");

app.UseSpa(spa =>
{
  spa.Options.DefaultPageStaticFileOptions = new StaticFileOptions()
  {
    FileProvider = fileProvider,
  };
});

app.Run();
