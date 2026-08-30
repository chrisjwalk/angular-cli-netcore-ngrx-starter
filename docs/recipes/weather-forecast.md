---
title: Weather forecast (entities, httpResource, auth-gated API)
area: fullstack
canonical: [libs/weather-forecast/src/lib/state/weather-forecast.store.ts, libs/weather-forecast/src/lib/services/weather-forecast.service.ts, libs/weather-forecast/src/lib/lib.routes.ts, libs/weather-forecast/src/lib/components/weather-forecast/weather-forecast.ts]
updated: 2026-08-16
---

# Weather forecast

The most layered feature: two store flavors composed from a shared filter feature, a service demonstrating both `HttpClient` and `httpResource`, and an auth-gated `plus` API variant selected by route.

## Canonical implementation

- `libs/weather-forecast/src/lib/state/weather-forecast.store.ts` —
  - `WeatherForecastStore` (plain array via `rxResource`) and `WeatherForecastEntityStore` (same + `withEntities<WeatherForecast>` with `selectId: dateFormatted`) — two flavors off the same feature functions
  - `weatherForecastFilter(forecasts: Signal)` — a **feature factory that takes a signal**: reusable min/max-temperature filter composed via `withFeature` into both stores
  - `getForecasts()` patches `{ count, plus }` state; the `rxResource` params computed refetches — unless the params are identical, in which case it calls `reload()` (re-clicking "Get Forecasts" refetches)
  - `onInit` seeds the request from `layoutStore.count()` + `authStore.pageRequiresLogin()`
- `libs/weather-forecast/src/lib/services/weather-forecast.service.ts` — both call styles side by side: `HttpClient.get` (for the rxResource store) and `httpResource<WeatherForecast[]>(() => ({ url, params }))` driven by a request signal
- `libs/weather-forecast/src/lib/lib.routes.ts` — `/weather-forecast` is public, `/weather-forecast/plus` is auth-gated (`canActivate` + `canDeactivate`)
- `apps/api` — `/api/weatherforecasts` and the auth-gated `/api/weatherforecastsplus` (controller-era endpoints)

## Conventions & gotchas

- **Composable features taking signals** — `weatherForecastFilter(weatherForecasts.value)` is how cross-cutting features (filtering) attach to different store shapes without duplication.
- `JSON.stringify` comparison decides reload vs. patch — cheap and adequate for a small param object.
- Component-scoped stores: `providers: [WeatherForecastStore, BreakpointStore]` on the component, not the route.
- `BreakpointStore` adapts the trigger UI (icon button on handset, flat button otherwise) — see `weather-forecast.ts`.

## Related

- [SignalStore state](signal-store.md) · [Route guards](auth-guards.md) · [Testing](testing.md)
