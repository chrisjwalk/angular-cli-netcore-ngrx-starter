---
title: Minimal APIs (in-memory + EF patterns)
area: backend
canonical: [apps/api/Api/Endpoints/TodoEndpoints.cs, apps/api/Api/Endpoints/AuthEndpoints.cs, apps/api/Api/DbContext.cs, apps/api/Api/Program.cs]
updated: 2026-08-16
---

# Minimal APIs

All new API surface is minimal-API endpoint groups (extension methods on `IEndpointRouteBuilder`); controllers are legacy (only `MapControllers()` + the Identity `MapIdentityApi` account group). Two persistence flavors coexist: in-memory (todos) and EF Core (auth/Identity).

## Canonical implementation

- `apps/api/Api/Endpoints/TodoEndpoints.cs` — the in-memory CRUD group:

```csharp
public static IEndpointRouteBuilder MapTodoEndpoints(this IEndpointRouteBuilder app)
{
  var group = app.MapGroup("/api/todos").WithTags("Todos");
  group.MapGet("", (TodoRepository repo) => Results.Ok(repo.GetAll()));
  group.MapPost("", (CreateTodoRequest req, TodoRepository repo) => ...);
  return app;
}
```

- DTOs are positional records in the same file; `Results.*` typed returns (`Results.Created/Ok/NotFound/NoContent`).
- `apps/api/Api/Endpoints/AuthEndpoints.cs` — EF-backed login/refresh/logout over ASP.NET Core Identity (`AddIdentityCore<AppUser>().AddEntityFrameworkStores<AppDbContext>()`).
- `apps/api/Api/DbContext.cs` — `IdentityDbContext<AppUser>` plus `RefreshTokens`; config in `OnModelCreating`.
- `apps/api/Api/Program.cs` — registration order: `AddDbContext` (SQL Server), Identity, singleton `TodoRepository`, `MapAuthEndpoints`/`MapTodoEndpoints`.

## Conventions & gotchas

- Health checks split by readiness: `/health/live` excludes all tagged checks (process up only), `/health/ready` includes the SQL check.
- Rate limiting: the `account` policy (10 req/min/IP fixed window) guards the Identity account group; rejection status is 429.
- `Program.cs` fail-fasts on missing `Jwt:*` config in **all** environments — `appsettings.Development.json` supplies dev values.
- CORS is preview-deployment-shaped: `*.azurestaticapps.net` + localhost, with credentials for the HttpOnly cookie exchange.
- PATCH partial updates: nullable request fields mean "unchanged" (record `with` expression in the repository).
- Swagger UI is served at `/swagger`.

## Related

- [Server-side CRUD](server-crud.md) · [EF migrations](ef-migrations.md) · [JWT auth](auth-jwt.md)
