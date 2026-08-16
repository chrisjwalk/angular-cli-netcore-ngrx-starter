---
name: create-feature
description: >
  Scaffold a new full-stack feature in this workspace — Nx library with routes,
  models, service, NgRx SignalStore, components, specs, nav + lazy route wiring,
  and optionally a .NET minimal-API endpoint group with xUnit tests and a
  Playwright e2e spec. Mirrors the todo feature as the canonical reference.
---

# Create a Feature

Use when asked to add a new page-level feature to the app. The canonical
reference is the todo feature (`libs/todo` + `apps/api/Api/Endpoints/TodoEndpoints.cs`),
documented in `docs/recipes/feature-library.md`, `docs/recipes/server-crud.md`,
and `docs/recipes/signal-store.md`. Read those recipes when in doubt — this
skill is the procedure.

## Step 0 – Ask the user

1. Feature name and route path (e.g. `products` at `/products`)?
2. Data shape and whether it is **API-backed** (own minimal-API endpoint group,
   in-memory repository first; EF only if persistence is required) or client-only?
3. Auth-gated (`requiresLoginCanActivateFn` from `@myorg/auth`) or public?
4. Needs an e2e spec?

## Step 1 – Issue and branch (AGENTS.md workflow)

```bash
gh issue create --title "feat: add <feature> feature" --body "..."
git checkout main && git pull
git checkout -b feat/add-<feature>-<issue-number>
```

## Step 2 – Generate the library

```bash
pnpm nx generate @nx/angular:library <feature> --directory=libs/<feature>
```

nx.json generator defaults already set `unitTestRunner: vitest-analog` and
`linter: eslint`. Then prune to the canonical layout (`libs/todo` is the
template):

- `src/index.ts` — barrel exporting routes, models, services, state, components
- `src/test-setup.ts` — newer style: `import '@myorg/shared/test-setup.shared';`
- `src/lib/lib.routes.ts` — exports `<feature>Routes: Route[]` with
  `providers: [<Feature>Store]` for route-scoped stores
- `src/lib/models/`, `src/lib/services/`, `src/lib/state/`, `src/lib/components/`
- Delete generated `.scss`/`.html`/`.spec.ts` files — AGENTS.md mandates single
  `.ts` components with inline templates, no `Component` suffix, OnPush, and a
  `data-testid` host attribute

The generator adds the `@myorg/<feature>` path to `tsconfig.base.json`
automatically.

## Step 3 – Service, store, models

- Models: plain types (`libs/todo/src/lib/models/todo.ts`)
- Service: all HTTP in `services/<feature>.service.ts` (`providedIn: 'root'`)
- Store: follow the `create-signalstore` skill (feature-first `signalStoreFeature`,
  rxResource reads with computed params, rxMethod + tapResponse mutations)

## Step 4 – Wire routing and navigation

- Add a `NAV_LINKS` entry in `libs/shared/src/lib/components/nav-links.ts`
- Add a lazy route in `apps/web-app/src/app/app.routes.ts`:
  `loadChildren: () => import('@myorg/<feature>').then((m) => m.<feature>Routes)`
- Auth-gated child routes: `canActivate: [requiresLoginCanActivateFn]` (see
  `libs/weather-forecast/src/lib/lib.routes.ts` and `docs/recipes/auth-guards.md`)
- Export everything from the barrel (`NG04014` is the symptom of a missing export)

## Step 5 – Specs (80% per-file coverage gate)

- Store spec: spy the service **before** creating the store (rxResource fetches
  immediately); `await appRef.whenStable()`; use real waits for timer-driven
  flows — fake timers + `whenStable` hang on pending timers
- Component specs: Testing Library `render` + `getByTestId`;
  `componentOutputs: { x: { emit: vi.fn() } }`; plain value/textContent
  assertions (no jest-dom matchers)
- Service spec: `HttpTestingController` with
  `expectOne((req) => req.url === '/api/todos')`-style URL matching (query
  strings break bare URL matching)
- Add a navigation test to `apps/web-app/src/app/app.integration.spec.ts`
  (provide `NotificationStore` + `SwUpdateStore` if the spec boots `App`)

## Step 6 – Optional: API endpoint group

- `apps/api/Api/Endpoints/<Feature>Endpoints.cs`: static
  `Map<Feature>Endpoints` group, positional record DTOs, `Results.*` returns,
  in-memory repository (record + `ConcurrentDictionary` singleton, like
  `TodoEndpoints.cs`) — register the group and the repository in `Program.cs`
  (see `docs/recipes/minimal-api-ef.md`)
- xUnit tests in `apps/api/Api.Test` over the repository (plain xUnit, no DB —
  see `UnitTest.cs`)
- Persistence required? Entity in `apps/api/Api/DbContext.cs` +
  `OnModelCreating` config, migration via
  `ASPNETCORE_ENVIRONMENT=Development dotnet ef migrations add <Name> --project apps/api/Api`
  (see `docs/recipes/ef-migrations.md`)

## Step 7 – Optional: e2e spec

`apps/web-app-e2e/src/<feature>.e2e.spec.ts` — serial mode for mutating specs,
testid-scoped assertions, `expect(...).toPass()` for post-fetch renders (see
`weather-forecast.e2e.spec.ts`). The playwright `webServer` already boots the
API (`/health/live`), counter-remote, and the app — no DB provisioning needed.

## Step 8 – Verify

```bash
pnpm nx lint <feature>
pnpm nx test <feature>
pnpm nx build web-app
pnpm e2e
pnpm format:write && pnpm format:check
```

## Pitfalls

| Symptom                           | Cause / fix                                                                                                                                                       |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NG04014 in the browser            | Missing barrel export — `export *` each new component from `src/index.ts`                                                                                         |
| Coverage threshold failure        | 80% per file — every new file needs a spec                                                                                                                        |
| Feature unreachable               | Forgot `NAV_LINKS` entry or the lazy route in `app.routes.ts`                                                                                                     |
| NG0203 in the MFE remote          | `@ngrx/signals/events` inlined by the federation plugin — avoid it in MFE-shared stores                                                                           |
| `unknown` type in rxMethod pipe   | Use an explicit arrow + parameter annotation, not a bare `pipe()`                                                                                                 |
| `mat-error` not showing on submit | Signal forms have no NgControl — guard `mat-error` with `@if (touched && invalid)` and call `markAsTouched()` in `submission.onInvalid` (see signal-forms recipe) |
