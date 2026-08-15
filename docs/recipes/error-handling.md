---
title: Error handling (layered: local UI, interceptor, ErrorHandler)
area: frontend
canonical: [apps/web-app/src/app/http-error.interceptor.ts, apps/web-app/src/app/error-handler.ts, apps/web-app/src/app/app.config.ts, libs/todo/src/lib/components/todo-page/todo-page.ts, libs/shared/src/lib/state/notification.store.ts]
updated: 2026-08-15
---

# Error handling

Three layers, each with a distinct job:

1. **Local inline UI** — feature-level domain errors: `mutationError` state with dismiss, `rxResource.error()` banners with retry (see `todo-page.ts`), form validation messages.
2. **HTTP error interceptor** — unexpected request failures (status `0`/network and `5xx`) routed into the `NotificationStore` as toasts.
3. **Global `ErrorHandler`** — unhandled exceptions reported to the same notification center.

## Canonical implementation

- `apps/web-app/src/app/http-error.interceptor.ts` — notifies only on `0`/`5xx`; `400`/`401`/`403`/`404`/`429` belong to their owning layers. **Always rethrows** so `authInterceptor`'s refresh and feature `tapResponse`/`resource.error()` still run.
- `apps/web-app/src/app/error-handler.ts` — skips `HttpErrorResponse` (already notified), uses `runInInjectionContext(this.injector, ...)` because `handleError()` runs outside any injection context.
- `apps/web-app/src/app/app.config.ts` — interceptor registered **last** (outermost); `NotificationStore`/`SwUpdateStore` root-provided there.

## Conventions & gotchas

- Notification stores are root-provided in `app.config.ts` — do not also list them in `App`'s component providers: that shadows the root instance and the bell would never show what the interceptor writes.
- Interceptor order matters: `[apiBaseUrlInterceptor, authInterceptor, httpErrorInterceptor]` — the error interceptor is outermost, sees every error, never swallows one.
- The toast message derives from the `HttpErrorResponse` (`status === 0` → "check your connection").
- `autoDismissMs: 8000` matches the other notification kinds' UX.

## Related

- [SignalStore state](signal-store.md) · [PWA & service worker](pwa.md)
