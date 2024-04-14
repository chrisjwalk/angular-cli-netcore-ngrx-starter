import { computed, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
import { map, pipe, switchMap, tap } from 'rxjs';

export type SwUpdateState = { versionEvent: VersionEvent };
export const swUpdateInitialState: SwUpdateState = {
  versionEvent: { type: null, version: null },
};

export const SwUpdateStore = signalStore(
  withState(swUpdateInitialState),
  withComputed((store) => ({
    updateReady: computed(() => store.versionEvent?.type() === 'VERSION_READY'),
  })),
  withMethods(
    (store, swUpdate = inject(SwUpdate), snackBar = inject(MatSnackBar)) => ({
      openReloadAppSnackbar: rxMethod<void>(
        pipe(
          switchMap(() =>
            snackBar
              .open(`App update avalable! Reload?`, 'OK', {
                duration: 15000,
              })
              .onAction()
              .pipe(
                tap(() =>
                  swUpdate
                    .activateUpdate()
                    .then(() => document.location.reload()),
                ),
              ),
          ),
        ),
      ),
    }),
  ),
  withMethods((store) => ({
    versionUpdates: rxMethod<VersionEvent>(
      pipe(
        map((versionEvent) => patchState(store, { versionEvent })),
        tap(() => {
          if (store.updateReady()) {
            store.openReloadAppSnackbar();
          }
        }),
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
