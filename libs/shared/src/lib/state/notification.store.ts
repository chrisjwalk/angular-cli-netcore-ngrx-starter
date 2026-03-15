import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

export type NotificationKind = 'sw-update' | 'auth' | 'error' | 'info';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  detail?: string;
  action?: {
    label: string;
    handler: () => void;
  };
  read: boolean;
  createdAt: Date;
  /** If set, the notification is automatically dismissed after this many ms. */
  autoDismissMs?: number;
}

export type NotificationState = {
  notifications: AppNotification[];
};

export const notificationInitialState: NotificationState = {
  notifications: [],
};

export const NotificationStore = signalStore(
  withState(notificationInitialState),
  withComputed(({ notifications }) => ({
    unreadCount: computed(() => notifications().filter((n) => !n.read).length),
  })),
  withMethods((store) => ({
    add(partial: Omit<AppNotification, 'id' | 'read' | 'createdAt'>): void {
      const notification: AppNotification = {
        id: crypto.randomUUID(),
        read: false,
        createdAt: new Date(),
        ...partial,
      };
      patchState(store, {
        notifications: [...store.notifications(), notification],
      });
      if (notification.autoDismissMs) {
        setTimeout(
          () => this.dismiss(notification.id),
          notification.autoDismissMs,
        );
      }
    },
    markRead(id: string): void {
      patchState(store, {
        notifications: store
          .notifications()
          .map((n) => (n.id === id ? { ...n, read: true } : n)),
      });
    },
    markAllRead(): void {
      patchState(store, {
        notifications: store.notifications().map((n) => ({ ...n, read: true })),
      });
    },
    dismiss(id: string): void {
      patchState(store, {
        notifications: store.notifications().filter((n) => n.id !== id),
      });
    },
  })),
);
