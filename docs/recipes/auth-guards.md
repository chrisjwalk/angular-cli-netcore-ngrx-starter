---
title: Route guards & login redirects
area: frontend
canonical: [libs/auth/src/lib/state/auth.store.ts, libs/weather-forecast/src/lib/lib.routes.ts]
updated: 2026-08-16
---

# Route guards & login redirects

Functional guards exported from `@myorg/auth` gate routes and send logged-out users to the login page, returning them to their original URL after login via `RedirectCommand`.

## Canonical implementation

- `libs/auth/src/lib/state/auth.store.ts` — the guards:

```ts
export function requiresLoginCanActivateFn(route, state) {
  const store = inject(AuthStore);
  const router = inject(Router);
  store.loginRequired(true);
  return store.loginStatus$.pipe(
    filter(() => store.loginAttempted()),
    map(() => store.loggedIn()),
    map((loggedIn) => (loggedIn ? loggedIn : (store.setRedirect(route, state), new RedirectCommand(router.parseUrl(loginRouterLink.join('/')))))),
  );
}
```

- `libs/weather-forecast/src/lib/lib.routes.ts` — the gated child route: `{ path: 'plus', component: WeatherForecast, canActivate: [requiresLoginCanActivateFn], canDeactivate: [requiresLoginCanDeactivateFn] }`
- The page itself branches on `authStore.pageRequiresLogin()` to hit the auth-gated `plus` API endpoint

## Conventions & gotchas

- **Never decide synchronously** — guards wait for the auth store's first `loginStatus$` emission (`loginAttempted()`), because login state is restored asynchronously on boot.
- `RedirectCommand` keeps browser history clean (no intermediate navigation entry) versus `router.navigate`.
- `setRedirect(route, state)` records the original URL so the login flow can return the user there.
- The todo feature shows the public default: no guard, route-scoped store.

## Related

- [JWT auth](auth-jwt.md) · [HTTP interceptors](http-interceptors.md) · [Feature library](feature-library.md)
