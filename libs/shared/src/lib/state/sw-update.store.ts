import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, map, pipe, switchMap, tap } from 'rxjs';

export type SwUpdateState = { updateReady: boolean };
export const swUpdateInitialState: SwUpdateState = { updateReady: false };

export const SwUpdateStore = signalStore(
  withState(swUpdateInitialState),
  withMethods(
    (store, swUpdate = inject(SwUpdate), snackBar = inject(MatSnackBar)) => ({
      versionUpdates: rxMethod<void>(() =>
        swUpdate.isEnabled
          ? swUpdate.versionUpdates.pipe(
              map(
                (evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY',
              ),
              map((updateReady) => {
                patchState(store, { updateReady });
              }),
            )
          : EMPTY,
      ),
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
);
