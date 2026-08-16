---
title: Deployment & CI
area: devops
canonical: [.github/workflows/ci.yml, .github/workflows/preview.yml, .github/workflows/deploy.yml, apps/web-app/src/staticwebapp.config.json]
updated: 2026-08-16
---

# Deployment & CI

Three pipelines: CI on every push/PR (lint → test → build → pack → e2e with coverage reporting), Azure Static Web Apps PR previews, and a production deploy to Azure App Service (OIDC) with a smoke test.

## Canonical implementation

- `.github/workflows/ci.yml` — Nx affected commands, Playwright (chromium + firefox), coverage summary + sticky PR comment
- `.github/workflows/preview.yml` — static-only preview: builds counter-remote + web-app with `COUNTER_REMOTE_ENTRY=/counter-remote/remoteEntry.js`, copies the remote into the client dir, deploys via SWA
- `.github/workflows/deploy.yml` — production: publishes the .NET API to `dist/` and the SPA to `dist/apps/web-app/client/` (matching `Program.cs`'s `PhysicalFileProvider`), `azure/webapps-deploy`, then `GET /health/live` smoke test with retries
- `apps/web-app/src/staticwebapp.config.json` — SPA fallback excluding static assets and the MFE paths

## Conventions & gotchas

- **EF migrations are not run by the pipeline** — deploy.yml notes it explicitly; production applies are a manual step (see ef-migrations recipe).
- Preview deployments are static-only — the API is CORS-whitelisted for `*.azurestaticapps.net` origins.
- The deploy triggers on `workflow_run` after CI succeeds on main — only green builds deploy.
- OIDC secrets needed: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, `AZURE_WEBAPP_NAME`.

## Related

- [EF migrations](ef-migrations.md) · [Micro-frontends](mfe.md) · [Testing](testing.md)
