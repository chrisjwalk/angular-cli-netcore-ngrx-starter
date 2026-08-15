---
title: PWA & service worker updates
area: frontend
canonical: [apps/web-app/vite.config.ts, apps/web-app/ngsw-config.json, libs/shared/src/lib/state/sw-update.store.ts, apps/web-app-e2e/src/pwa-update.e2e.spec.ts]
updated: 2026-08-15
---

# PWA & service worker updates

A `VitePWA`-based service worker with a prompt-based update flow: the `SwUpdateStore` detects a new app version, surfaces a notification with a one-click reload, and a debug page exercises the whole path.

## Canonical implementation

- `apps/web-app/vite.config.ts` — `VitePWA` plugin (manifest, `ngsw-config.json`); MF remotes stub `virtual:pwa-register` (`virtual-pwa-register-stub` plugin) since they don't run the SW
- `libs/shared/src/lib/state/sw-update.store.ts` — `registerSW` from `virtual:pwa-register` with `registerType: 'prompt'`; on update, adds an `sw-update` notification with a reload action
- `apps/web-app/src/app/debug/debug.ts` — fires every notification kind and inspects SW state

## Conventions & gotchas

- `NotificationStore`/`SwUpdateStore` are root-provided in `app.config.ts` — see error-handling recipe for the shadowing trap.
- SW-registration e2e tests are gated to CI + production builds (route interception serves `sw.js`), because the dev server doesn't serve the worker.
- `/assets/home.md` is precached — keep the sync hook in mind when editing the README (analog-content recipe).

## Related

- [Error handling](error-handling.md) · [Markdown content pages](analog-content.md) · [Micro-frontends](mfe.md)
