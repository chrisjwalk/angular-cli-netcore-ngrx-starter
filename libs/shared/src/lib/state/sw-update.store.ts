import { computed, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, map, pipe, tap } from 'rxjs';

export type SwUpdateState = {
  versionEvent: VersionEvent;
  message: string;
  action: string;
  snackbarConfig: MatSnackBarConfig;
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
  message: `App update avalable! Reload?`,
  action: `OK`,
  snackbarConfig: {
    duration: 15000,
  },
};

export const SwUpdateStore = signalStore(
  withState(swUpdateInitialState),
  withComputed((store) => ({
    updateReady: computed(() => store.versionEvent?.type() === 'VERSION_READY'),
  })),
  withMethods((store, swUpdate = inject(SwUpdate)) => ({
    reloadAppOnAction: rxMethod<void>(
      pipe(
        tap(async () => {
          await swUpdate.activateUpdate();
          document.location.reload();
        }),
      ),
    ),
  })),
  withMethods((store, snackBar = inject(MatSnackBar)) => ({
    versionUpdates: rxMethod<VersionEvent>(
      pipe(
        map((versionEvent) => patchState(store, { versionEvent })),
        map(() => store.updateReady()),
        filter((updateReady) => updateReady),
        tap(() =>
          store.reloadAppOnAction(
            snackBar
              .open(store.message(), store.action(), store.snackbarConfig())
              .onAction(),
          ),
        ),
      ),
    ),
  })),
  withHooks((store, swUpdate = inject(SwUpdate)) => ({
    onInit() {
      if (swUpdate.isEnabled) {
        store.versionUpdates(swUpdate.versionUpdates);
      }
    },
  })),
);
