---
title: Counter feature (signalMethod + MFE remote)
area: frontend
canonical: [libs/counter/src/lib/state/counter.store.ts, libs/counter/src/lib/components, apps/counter-remote, apps/web-app/src/test-stubs/counter-remote-routes.ts]
updated: 2026-08-16
---

# Counter feature

The Counter feature is the minimal client-only feature, doubled as a Module Federation remote: a root `CounterStore` using `signalMethod`, UI in `libs/counter`, exposed by the standalone `counter-remote` app.

## Canonical implementation

- `libs/counter/src/lib/state/counter.store.ts` — root-provided (`providedIn: 'root'`); `incrementCount`/`decrementCount`/`setCount` via `patchState`, typed input via `signalMethod<number | string>`
- `libs/counter/src/lib/components/` — `counter` + `counter-container` (single `.ts` components per AGENTS.md)
- `apps/counter-remote/src/remote-routes.ts` — the remote's exposed `./Routes`; the host lazy-loads `import('counter-remote/Routes')`
- `apps/web-app/src/test-stubs/counter-remote-routes.ts` — vitest alias replaces the remote with local routes in specs

## Conventions & gotchas

- **`@ngrx/signals/events` is deliberately avoided in MFE-shared stores** — its `takeUntilDestroyed` dependency gets inlined with a private `_injectImplementation` by the federation plugin, causing NG0203 when the store is created in the remote (see the NOTE in `counter.store.ts`).
- `signalMethod` over `effect()` for signal reactions (AGENTS.md) — explicit input, testable.
- The remote must be self-contained: `counter-remote` bundles `@myorg/counter` only (no `@myorg/shared`), since Rolldown can't enumerate `export *` chains for MF sharing.

## Related

- [Micro-frontends](mfe.md) · [SignalStore state](signal-store.md) · [Testing](testing.md)
