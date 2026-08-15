---
title: NgRx SignalStore patterns
area: frontend
canonical: [libs/todo/src/lib/state/todo.store.ts, libs/auth/src/lib/state/auth.store.ts, libs/counter/src/lib/state/counter.store.ts, libs/shared/src/lib/state/loading.feature.ts]
updated: 2026-08-15
---

# NgRx SignalStore patterns

All state is NgRx SignalStore, composed from `signalStoreFeature()` functions. The `create-signalstore` skill has the full generation guide; this recipe is the summary.

## Canonical implementation

- `libs/todo/src/lib/state/todo.store.ts` — feature-first store with query state driving an `rxResource`, mutations via `rxMethod` + `tapResponse` + reload
- `libs/auth/src/lib/state/auth.store.ts` — root-provided singleton (`providedIn: 'root'`)
- `libs/counter/src/lib/state/counter.store.ts` — `signalMethod` usage
- `libs/shared/src/lib/state/loading.feature.ts` — reusable `withLoadingFeature()` composed into other stores
- `libs/weather-forecast/src/lib/state/weather-forecast.store.ts` — `withEntities` + `selectId`

## Conventions & gotchas

- **Reads**: `rxResource` with a `computed` params signal — any params change refetches. Mutations: `rxMethod` + `tapResponse`, then `resource.reload()` (or patch the params so the resource refetches).
- **`rxResource.value()` drops to `undefined` during refetches.** Keep the last envelope in a closure-backed computed if anything depends on it (see `todo.store.ts`) — otherwise a paginator's `length` dips to 0, clamps `pageIndex`, and emits a page event that reverts the page.
- `rxMethod` over manual subscribe, `signalMethod` over `effect()` (AGENTS.md).
- `updateFilter`-style debounced inputs: `rxMethod<string>((source$) => source$.pipe(debounceTime(300), tap(...)))` — use an explicit arrow + parameter annotation; inference through a bare `pipe()` yields `unknown`.
- Stores that must be singletons use `providedIn: 'root'`; route-scoped stores go in the route's `providers` array.
- HTTP lives in services injected via `withProps`; components never call HTTP.

## Related

- [Feature library](feature-library.md) · [Server-side CRUD](server-crud.md) · [Testing](testing.md)
