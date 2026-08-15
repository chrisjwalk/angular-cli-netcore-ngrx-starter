---
title: Testing (unit, integration, e2e)
area: testing
canonical: [libs/todo/src/lib/state/todo.store.spec.ts, libs/todo/src/lib/components/todo-page/todo-page.spec.ts, apps/web-app/src/app/app.integration.spec.ts, apps/api/Api.Test/TodoRepositoryTests.cs, apps/web-app-e2e/src/todo.e2e.spec.ts]
updated: 2026-08-15
---

# Testing

Four layers: vitest unit specs per lib, an app-level integration spec, xUnit tests for the API, and Playwright e2e against a self-contained SQLite API.

## Canonical implementation

- **Store specs** — `libs/todo/src/lib/state/todo.store.spec.ts`: `TestBed` with `TodoStore` + `provideHttpClient`/`Testing`; spy the service BEFORE creating the store (rxResource fetches immediately); `await appRef.whenStable()`; debounced flows use real ~350ms waits (fake timers + `whenStable` hang on pending timers)
- **Component specs** — Testing Library `render` + `getByTestId`; inputs via `inputs: {...}`, outputs via `componentOutputs: { x: { emit: vi.fn() } }`; no jest-dom matchers in this setup — use `element.value`/`textContent` assertions
- **Integration** — `apps/web-app/src/app/app.integration.spec.ts` boots the real `App` + `routes`; new features get a navigation test here
- **API tests** — `apps/api/Api.Test/TodoRepositoryTests.cs`: xUnit + SQLite in-memory (`SqliteConnection("DataSource=:memory:")` + `EnsureCreated()`); SQLite validates real SQL translation of LINQ, unlike the EF InMemory provider
- **E2E** — `apps/web-app-e2e/src/todo.e2e.spec.ts`: serial mode for mutating specs, testid-scoped assertions, `expect(...).toPass()` polls for post-fetch renders, `test.skip` when preconditions aren't met (e.g. < 10 seeded todos)

## Conventions & gotchas

- The vitest coverage gate is 80% **per file** — every new/changed lib file needs a spec.
- `TodoService` specs use `HttpTestingController` + `expectOne((req) => req.url === '/api/todos')` (query strings break bare URL matching).
- e2e runs the API with `USE_SQLITE=true` (see ef-migrations recipe) so it's deterministic and offline.
- Historic lesson: todos e2e mutates shared state — keep such specs serial with generous timeouts.
- E2E browser installs are version-pinned; after a Playwright bump run `pnpm exec playwright install chromium firefox`.

## Related

- [SignalStore state](signal-store.md) · [Server-side CRUD](server-crud.md) · [EF migrations](ef-migrations.md)
