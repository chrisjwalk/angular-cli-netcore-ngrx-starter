---
title: Notification center
area: frontend
canonical: [libs/shared/src/lib/state/notification.store.ts, libs/shared/src/lib/components/notification-bell.ts, libs/shared/src/lib/components/notification-list.ts, apps/web-app/src/app/app.ts, apps/web-app/src/app/debug/debug.ts]
updated: 2026-08-16
---

# Notification center

A persistent notification panel (toolbar bell + unread badge + list) driven by `NotificationStore`. Kinds are `'sw-update' | 'auth' | 'error' | 'info'`; notifications support details, one action button, and auto-dismiss.

## Canonical implementation

- `libs/shared/src/lib/state/notification.store.ts` — `AppNotification` model (`id/kind/title/detail/action/read/createdAt/autoDismissMs`); `add()` assigns `crypto.randomUUID()` + timestamps and schedules `autoDismissMs`; `markRead`/`markAllRead`/`dismiss`; `unreadCount` computed
- `apps/web-app/src/app/app.ts` — provides `NotificationStore` + `SwUpdateStore` at the App level
- `libs/shared/src/lib/components/notification-bell.ts` + `notification-list.ts` — the panel UI (bell with badge, per-kind icons, action buttons)
- `apps/web-app/src/app/debug/debug.ts` — fires every kind and inspects service-worker state

## Conventions & gotchas

- **Provide the store exactly once (App providers).** Re-providing it in a feature shadows the instance the toolbar bell reads — notifications silently vanish.
- Actions are closures (`action: { label, handler }`) — keep handlers small; they aren't serializable state.
- `autoDismissMs` schedules dismissal with `setTimeout` inside the store, matching the other kinds' UX (`8000`).
- `SwUpdateStore` is the canonical producer: an `sw-update` notification with a one-click reload action.

## Related

- [Error handling](error-handling.md) · [PWA & service worker](pwa.md) · [SignalStore state](signal-store.md)
