---
title: 'Error handling (layered: local UI + notifications)'
area: frontend
canonical: [libs/todo/src/lib/components/todo-page/todo-page.ts, libs/auth/src/lib/state/auth.interceptor.ts, libs/shared/src/lib/state/notification.store.ts, apps/web-app/src/app/app.ts]
updated: 2026-08-16
---

# Error handling

Three layers, each with a distinct job:

1. **Per-feature inline errors** — `mutationError` dismissible banner and `rxResource` error banner with retry (see `todo-page.ts`), form validation via `mat-error`.
2. **Auth flow** — the auth interceptor owns 401s: refresh, retry once, logout on failure (see http-interceptors recipe).
3. **Notification center** — the app-wide surface for non-request events: `sw-update` notifications with a reload action; kinds are `'sw-update' | 'auth' | 'error' | 'info'`.

## Canonical implementation

- `libs/todo/src/lib/components/todo-page/todo-page.ts` — the two banner patterns: dismissible mutation error, and a resource-error banner wired to `store.reload()`
- `libs/auth/src/lib/state/auth.interceptor.ts` — refresh + retry on 401, logout + rethrow on refresh failure
- `libs/shared/src/lib/state/notification.store.ts` — `add()` (auto-assigns id/read/createdAt, schedules `autoDismissMs`), `markRead`, `markAllRead`, `dismiss`
- `apps/web-app/src/app/app.ts` — provides `NotificationStore` + `SwUpdateStore` at the App level

## Conventions & gotchas

- **Provide `NotificationStore`/`SwUpdateStore` exactly once (App providers).** Re-providing them in a feature shadows the instance the toolbar bell reads — notifications would silently vanish.
- 400/404s are feature concerns (`mutationError` / resource errors), not toasts — nothing global rewrites them.
- `SwUpdateStore` demonstrates action notifications: `action: { label: 'Reload', handler }`.
- Mutation errors are cleared on success in `tapResponse.next`, so a retry that succeeds removes the banner.

## Related

- [HTTP interceptors](http-interceptors.md) · [Notification center](notifications.md) · [PWA & service worker](pwa.md) · [SignalStore state](signal-store.md)
