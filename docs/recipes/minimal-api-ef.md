---
title: Minimal APIs + EF Core
area: backend
canonical: [apps/api/Api/Endpoints/TodoEndpoints.cs, apps/api/Api/Endpoints/AuthEndpoints.cs, apps/api/Api/DbContext.cs, apps/api/Api/Services/TodoRepository.cs]
updated: 2026-08-15
---

# Minimal APIs + EF Core

All new API surface is minimal-API endpoint groups (extension methods on `IEndpointRouteBuilder`); controllers are legacy. Entities live directly in `DbContext.cs`.

## Canonical implementation

- `apps/api/Api/Endpoints/TodoEndpoints.cs` — the canonical group shape:

```csharp
public static IEndpointRouteBuilder MapTodoEndpoints(this IEndpointRouteBuilder app)
{
  var group = app.MapGroup("/api/todos").WithTags("Todos");
  group.MapGet("", async ([AsParameters] TodoQuery query, TodoRepository repo) => { ... });
  return app;
}
```

- DTOs are positional records in the same file; `Results.*` typed returns (`Results.Ok/Created/NotFound/ValidationProblem`).
- `apps/api/Api/DbContext.cs` — `AppDbContext : IdentityDbContext<AppUser>` plus `DbSet<TodoItem>`; config in `OnModelCreating`.
- `apps/api/Api/Services/TodoRepository.cs` — scoped repositories; sort whitelists as `Expression` maps.

## Conventions & gotchas

- Query params bind via a positional record + `[AsParameters]`; validate manually and return `Results.ValidationProblem` with per-field string arrays.
- `.NET 10` ships `AddValidation()`/`[ValidatableType]`, but the analyzer flags it experimental (error-level ASP0029) — this repo uses explicit handler validation instead.
- `DateTimeOffset` columns cannot be ordered by SQLite (the xUnit provider) — audit fields use UTC `DateTime`; `DateTimeOffset` is fine when never sorted (`RefreshToken.ExpiresAt`).
- Register endpoint groups in `Program.cs`: `app.MapTodoEndpoints();`.
- Rate limiting exists per-policy (the `account` policy guards login/register); auth-gating uses `.RequireAuthorization()` on the group.

## Related

- [Server-side CRUD](server-crud.md) · [EF migrations](ef-migrations.md) · [JWT auth](auth-jwt.md) · [Testing](testing.md)
