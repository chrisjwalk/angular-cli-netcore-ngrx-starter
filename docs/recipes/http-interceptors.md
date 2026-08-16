---
title: HTTP interceptors (base URL + auth refresh)
area: frontend
canonical: [apps/web-app/src/app/app.config.ts, apps/web-app/src/app/api-base-url.interceptor.ts, libs/auth/src/lib/state/auth.interceptor.ts]
updated: 2026-08-16
---

# HTTP interceptors

Two functional interceptors (`HttpInterceptorFn`), registered in order: base-URL rewriting first, auth refresh last. Interceptor order is part of the API.

## Canonical implementation

- `apps/web-app/src/app/app.config.ts` — `withInterceptors([apiBaseUrlInterceptor, authInterceptor])`
- `apps/web-app/src/app/api-base-url.interceptor.ts` — prefixes `environment.apiBaseUrl` on `/api` requests only (preview deployments point at the shared production API); everything else passes through untouched
- `libs/auth/src/lib/state/auth.interceptor.ts` — attaches `Authorization: Bearer` when logged in; on 401, refreshes and retries once

```ts
return next(req).pipe(
  catchError((error) => {
    if (error?.status === 401) {
      // Only start a new refresh when one isn't already in flight.
      if (!store.loginLoading()) {
        store.refresh();
      }
      return store.loginStatus$.pipe(
        filter(() => store.loginAttempted()),
        switchMap(() => (store.loggedIn() ? next(setAuthorizationHeader(req, store.accessToken())) : (store.logout(true), throwError(() => error)))),
      );
    }
    return throwError(() => error);
  }),
);
```

## Conventions & gotchas

- **One refresh at a time** — concurrent 401s subscribe to the same `loginStatus$` and wait for the in-flight refresh (`store.loginLoading()` guard).
- **Rethrow everything you don't handle** — the feature-level `tapResponse`/`resource.error()` layers depend on the error reaching them.
- Order matters: base URL must run before auth, so the auth interceptor retries the already-prefixed URL.
- Functional interceptors use `inject()` — no class boilerplate, no `@Injectable`.

## Related

- [JWT auth](auth-jwt.md) · [Route guards](auth-guards.md) · [Error handling](error-handling.md)
