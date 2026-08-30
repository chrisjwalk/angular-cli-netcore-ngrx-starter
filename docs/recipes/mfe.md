---
title: Micro-frontends (Module Federation)
area: architecture
canonical: [apps/counter-remote, apps/web-app/src/test-stubs/counter-remote-routes.ts, .claude/skills/create-mfe/SKILL.md]
updated: 2026-08-15
---

# Micro-frontends

The Counter feature runs as a separate Module Federation remote (`counter-remote`) loaded by the host (`web-app`) via `@module-federation/vite`. The `create-mfe` skill is the full 12-step guide; this recipe is the summary.

## Canonical implementation

- `apps/counter-remote` — a standalone Analog app exposing one route file (`./Routes`); the host lazy-loads it via `loadChildren: () => import('counter-remote/Routes')`
- `apps/web-app/src/test-stubs/counter-remote-routes.ts` — vitest alias (`counter-remote/Routes` → stub) keeps the integration spec MFE-free
- `apps/web-app/vite.config.ts` — `federation({ remotes })` + `mfeSharedDeps`; `COUNTER_REMOTE_ENTRY` env var points the prod build at the co-deployed remote

## Conventions & gotchas

- Angular core, CDK/Material, NgRx, RxJS are shared singletons (`import: false` on every CDK/Material sub-path in the remote) to prevent NG0912 component-ID collisions.
- Workspace libs (`@myorg/*`) are never shared — Rolldown can't enumerate `export *` chains; remotes bundle their libs self-contained.
- Preview/prod builds copy the remote's output into the host's client dir and set `COUNTER_REMOTE_ENTRY`; SWA `navigationFallback.exclude` allows one `*` per path segment.
- Remotes stub `virtual:pwa-register` — only the host registers the service worker.

## Related

- [Feature library](feature-library.md) · [PWA & service worker](pwa.md) · [Deployment & CI](deployment.md)
