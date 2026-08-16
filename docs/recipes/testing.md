---
title: Testing (unit, integration, e2e)
area: testing
canonical: [libs/todo/src/lib/state/todo.store.spec.ts, libs/todo/src/lib/components/todo-page/todo-page.spec.ts, apps/web-app/src/app/app.integration.spec.ts, apps/api/Api.Test/UnitTest.cs, apps/web-app-e2e/src/weather-forecast.e2e.spec.ts, apps/web-app-e2e/playwright.config.ts]
updated: 2026-08-16
---

# Testing

Four layers: vitest unit specs per lib, an app-level integration spec, xUnit tests for the API repository, and Playwright e2e (chromium + firefox) that boots the full stack via `webServer`.

## Canonical implementation

- **Store specs** — `libs/todo/src/lib/state/todo.store.spec.ts`: `TestBed` with `TodoStore` + `provideHttpClient`/`Testing`; spy the service **before** creating the store (rxResource fetches immediately); `await appRef.whenStable()`
- **Component specs** — Testing Library `render` + `getByTestId`; inputs via `inputs: {...}`, outputs via `componentOutputs: { x: { emit: vi.fn() } }`; no jest-dom matchers — use `element.value`/`textContent` assertions
- **Integration** — `apps/web-app/src/app/app.integration.spec.ts` boots the real `App` + `routes`; provide `NotificationStore` + `SwUpdateStore` (they're App providers); new features get a navigation test here
- **API tests** — `apps/api/Api.Test/UnitTest.cs`: plain xUnit over the in-memory `TodoRepository` (no DB, no provider needed)
- **E2E** — `playwright.config.ts` `webServer` trio: `api:serve` (waits on `/health/live`), `counter-remote:serve`, `web-app:serve-e2e` — CI switches to production variants; mutating specs run serial with generous timeouts

## Conventions & gotchas

- The vitest coverage gate is 80% **per file** — every new/changed lib file needs a spec.
- `TodoService` specs use `HttpTestingController` + `expectOne((req) => req.url === '/api/todos')` (query strings break bare URL matching).
- E2E specs exist per feature (home, content, counter, login, weather-forecast, navigation, mfe-integration, pwa-update) — follow the nearest one when adding a feature.
- Playwright browsers are version-pinned; after a Playwright bump run `pnpm exec playwright install chromium firefox`.
- The vitest alias in `vite.config.ts` stubs `counter-remote/Routes` with local routes so the integration spec stays MFE-free.

## Related

- [SignalStore state](signal-store.md) · [Server-side CRUD](server-crud.md) · [Deployment & CI](deployment.md)
