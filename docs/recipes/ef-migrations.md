---
title: EF Core migrations (Identity)
area: backend
canonical: [apps/api/Api/Migrations, apps/api/Api/DbContext.cs, apps/api/Api/Program.cs, .github/workflows/deploy.yml]
updated: 2026-08-16
---

# EF Core migrations

Two Identity migrations (`InitialCreate`, `AddRefreshTokens`) plus the model snapshot. Migrations are **not** applied at startup and **not** run by CI — applying them is a manual, documented step.

## Commands

```bash
# dotnet-ef is not pinned as a local tool; install it matching the SDK major:
dotnet tool install --global dotnet-ef

# The env var matters: Program.cs fail-fasts on missing Jwt:* config, and
# appsettings.Development.json supplies it (plus the Azure SQL connection string).
ASPNETCORE_ENVIRONMENT=Development dotnet ef database update --project apps/api/Api
```

## Applying migrations

- **Development** — the dev DB is Azure SQL via `AZURE_SQL_CONNECTIONSTRING`; run `database update` by hand after pulling a schema change.
- **Production** — deploy.yml explicitly notes it does not run migrations; apply manually against the App Service DB.
- `dotnet ef` host-builds the app to discover `AppDbContext`, which is why the Jwt config must resolve (see the fail-fast in `Program.cs`).

## Conventions & gotchas

- Entities live in `apps/api/Api/DbContext.cs` (`AppDbContext : IdentityDbContext<AppUser>` + `RefreshTokens`); config in `OnModelCreating`.
- Review generated `AlterColumn`/`DropIndex` operations before committing — migrations can reconcile pre-existing schema/model drift (e.g. nullability from before `Nullable` was enabled).
- Regenerate rather than hand-edit when changing column types: `dotnet ef migrations remove` then re-add.

## Related

- [Minimal APIs](minimal-api-ef.md) · [Deployment & CI](deployment.md) · [JWT auth](auth-jwt.md)
