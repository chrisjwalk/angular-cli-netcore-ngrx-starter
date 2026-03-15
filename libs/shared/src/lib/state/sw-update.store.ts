import { computed, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import {
  patchState,
  signalStore,
  signalStoreFeature,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, map, pipe, tap } from 'rxjs';
import { NotificationStore } from './notification.store';

export type SwUpdateState = {
  versionEvent: VersionEvent;
};

const versionDefault = {
  hash: null,
  appData: null,
};

export const swUpdateInitialState: SwUpdateState = {
  versionEvent: {
    type: null,
    error: null,
    version: versionDefault,
    currentVersion: versionDefault,
    latestVersion: versionDefault,
  },
};

export function withSwUpdateFeature() {
  return signalStoreFeature(
    withState(swUpdateInitialState),
    withProps(() => ({
      swUpdate: inject(SwUpdate),
      notificationStore: inject(NotificationStore),
    })),
    withComputed((store) => ({
      updateReady: computed(
        () => store.versionEvent?.type() === 'VERSION_READY',
      ),
    })),
    withMethods(({ swUpdate }, doc = inject(DOCUMENT)) => ({
      checkForUpdate: rxMethod<unknown>(
        pipe(tap(() => swUpdate.checkForUpdate())),
      ),
    })),
    withMethods(
      ({ swUpdate, notificationStore, ...store }, doc = inject(DOCUMENT)) => ({
        versionUpdates: rxMethod<VersionEvent>(
          pipe(
            map((versionEvent) => patchState(store, { versionEvent })),
            map(() => store.updateReady()),
            filter((updateReady) => updateReady),
            tap(() =>
              notificationStore.add({
                kind: 'sw-update',
                title: 'App update available',
                detail: 'A new version is ready. Reload to update.',
                action: {
                  label: 'Reload',
                  handler: async () => {
                    await swUpdate.activateUpdate();
                    doc.location.reload();
                  },
                },
              }),
            ),
          ),
        ),
      }),
    ),
  );
}

/**
 * Service Worker Update Store
 *
 * Subscribes to SwUpdate.versionUpdates and prompts for reload when
 * a new version is available. Checks for updates on each NavigationEnd
 * so the prompt only appears while the user is actively using the app.
 * This just needs to be provided/injected into the main app component
 * to function.
 */
export const SwUpdateStore = signalStore(
  withSwUpdateFeature(),
  withHooks((store, swUpdate = inject(SwUpdate), router = inject(Router)) => ({
    onInit() {
      if (swUpdate.isEnabled) {
        store.versionUpdates(swUpdate.versionUpdates);
        store.checkForUpdate(
          router.events.pipe(filter((e) => e instanceof NavigationEnd)),
        );
      }
    },
  })),
);
