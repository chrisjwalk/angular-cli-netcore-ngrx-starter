---
title: JWT auth with refresh rotation
area: fullstack
canonical: [apps/api/Api/Endpoints/AuthEndpoints.cs, apps/api/Api/Services/TokenService.cs, libs/auth/src/lib/state/auth.store.ts, libs/auth/src/lib/state/auth.interceptor.ts]
updated: 2026-08-16
---

# JWT auth with refresh rotation

ASP.NET Core Identity with custom JWT bearer endpoints and rotating refresh tokens in HttpOnly cookies; the Angular side holds auth state in a root SignalStore and refreshes transparently via an interceptor.

## Canonical implementation

- `apps/api/Api/Endpoints/AuthEndpoints.cs` — `/api/auth/{login,refresh,logout}`; login returns `{ tokenType, accessToken, expiresIn }` (plus a `requiresTwoFactor` challenge flow); refresh sets `refreshToken` (HttpOnly, Secure outside dev, SameSite.Strict) + `auth_status` (JS-readable presence indicator so the client can skip silent refresh)
- `apps/api/Api/Services/TokenService.cs` — HS256 access tokens (1h) from `Jwt:Key`; refresh tokens are 64 random bytes stored in `RefreshTokens` with rotation
- `libs/auth/src/lib/state/auth.store.ts` — root-provided; `loggedIn()`, login/logout/refresh state
- `libs/auth/src/lib/state/auth.interceptor.ts` — attaches `Authorization: Bearer`; on 401, attempts refresh then retries once

## Conventions & gotchas

- Account endpoints (`/api/account/*` via `MapIdentityApi`) are rate-limited by the `account` policy (10 req/min/IP); login/refresh have their own wiring in `AuthEndpoints`.
- `ClockSkew = TimeSpan.Zero` — tokens expire exactly on schedule.
- CORS allows `*.azurestaticapps.net` + localhost with credentials (cookie exchange for preview deployments).
- 401s are owned solely by the auth interceptor — nothing else in the app treats them (see http-interceptors recipe).
- Program.cs fail-fasts when `Jwt:*` config is missing — in **all** environments (`appsettings.Development.json` supplies dev values). That keeps misconfigured deployments loud instead of 500ing at request time.

## Related

- [HTTP interceptors](http-interceptors.md) · [Minimal APIs](minimal-api-ef.md) · [Deployment & CI](deployment.md)
