---
title: EF Core migrations
area: backend
canonical: [apps/api/Api/Migrations, apps/api/Api/Program.cs, apps/api/Api/Services/TodoSeeder.cs, .config/dotnet-tools.json]
updated: 2026-08-15
---

# EF Core migrations

Migrations are applied at startup, seeded in development, and opt-in in production. The `USE_SQLITE` flag gives e2e and offline dev a self-contained database.

## Commands

```bash
# dotnet-ef is a local tool (see .config/dotnet-tools.json); restore with `dotnet tool restore`
# The env var is required: Program.cs fail-fasts on missing Jwt:* outside Development,
# and dotnet-ef builds the app host to discover AppDbContext.
ASPNETCORE_ENVIRONMENT=Development dotnet dotnet-ef migrations add <Name> --project apps/api/Api
```

## Startup strategy (Program.cs)

- **Development**: `Migrate()` on every startup + seed 12 demo todos when the table is empty (`TodoSeeder.DemoTodos`).
- **Production**: opt in via `RUN_EF_MIGRATIONS=true` App Service setting — deploy.yml has no post-deploy execution context. Single-instance only; use a migration job if scaling out.
- **`USE_SQLITE=true`**: SQLite file in the OS temp dir with `EnsureCreated()` (SQL Server migrations are provider-specific) — used by the Playwright e2e suite so tests don't depend on Azure SQL.
- Development migration failures are logged as warnings, not fatal — the dev loop survives an unreachable database; production fails fast.

## Conventions & gotchas

- Migrations reconcile pre-existing schema/model drift (e.g. nullability from before `Nullable` was enabled) — review generated `AlterColumn`/`DropIndex` operations before committing.
- Tests never run migrations; they use SQLite in-memory + `EnsureCreated()` (see testing recipe).
- Regenerate rather than hand-edit when changing column types: `dotnet dotnet-ef migrations remove` then re-add (removal probes the DB, so it needs connectivity — with an unreachable DB, delete the files and regenerate).

## Related

- [Minimal APIs + EF Core](minimal-api-ef.md) · [Testing](testing.md) · [Deployment & CI](deployment.md)
