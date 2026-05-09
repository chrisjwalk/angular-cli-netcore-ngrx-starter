import { inject } from '@angular/core';
import { registerSW } from 'virtual:pwa-register';
import {
  signalStore,
  signalStoreFeature,
  withHooks,
  withMethods,
  withProps,
} from '@ngrx/signals';
import { NotificationStore } from './notification.store';

export function withSwUpdateFeature() {
  return signalStoreFeature(
    withProps(() => ({
      notificationStore: inject(NotificationStore),
    })),
  );
}

export const SwUpdateStore = signalStore(
  withSwUpdateFeature(),
  withMethods((store) => ({
    onNeedRefresh(updateSW: (reloadPage?: boolean) => Promise<void>) {
      store.notificationStore.add({
        kind: 'sw-update',
        title: 'App update available',
        detail: 'A new version is ready. Reload to update.',
        action: {
          label: 'Reload',
          handler: () => updateSW(true),
        },
      });
    },
  })),
  withHooks((store) => ({
    onInit() {
      const updateSW = registerSW({
        onNeedRefresh() {
          store.onNeedRefresh(updateSW);
        },
      });
    },
  })),
);
