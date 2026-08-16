---
title: Feature library (routes, nav, lazy loading)
area: frontend
canonical: [libs/todo, libs/shared/src/lib/components/nav-links.ts, apps/web-app/src/app/app.routes.ts]
updated: 2026-08-15
---

# Feature library

Every page-level feature is an Nx library under `libs/<feature>` with a fixed layout, lazy-loaded by the host app. The todo feature is the canonical example — scaffold new features with the `create-feature` skill.

## Canonical implementation

- `libs/todo/src/lib/lib.routes.ts` — exports `<name>Routes: Route[]`; the store is route-scoped via `providers: [Store]` so it dies with the route
- `libs/todo/src/index.ts` — barrel exporting routes, models, services, state, components
- `apps/web-app/src/app/app.routes.ts` — host lazy-loads via `loadChildren: () => import('@myorg/todo').then(m => m.todoRoutes)`
- `libs/shared/src/lib/components/nav-links.ts` — `NAV_LINKS` is the single source of truth for toolbar + sidenav

## Conventions & gotchas

- Adding a feature = barrel + `lib.routes.ts` + one lazy route in `app.routes.ts` + one `NAV_LINKS` entry. Forgetting either nav or route is the classic half-wired feature.
- Auth-gated routes use `canActivate: [requiresLoginCanActivateFn]` from `@myorg/auth` (see `libs/weather-forecast/src/lib/lib.routes.ts`).
- Components are single `.ts` files, inline templates, no `Component` suffix, OnPush, `host: {'data-testid': ...}` — see AGENTS.md.
- Workspace libs are NOT shared to MFE remotes (Module Federation can't enumerate `@myorg/*` exports) — keep remotes self-contained.

## Related

- [SignalStore state](signal-store.md) · [Server-side CRUD](server-crud.md) · [Micro-frontends](mfe.md)
