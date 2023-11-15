import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, map, tap } from 'rxjs';

export type SwUpdateState = { updateReady: boolean };

@Injectable()
export class SwUpdateStore extends ComponentStore<SwUpdateState> {
  private swUpdate = inject(SwUpdate);
  private snackBar = inject(MatSnackBar);

  constructor() {
    super({ updateReady: false });
  }

  updateReady = this.selectSignal((state) => state.updateReady);

  readonly versionUpdates = this.effect(() =>
    this.swUpdate.isEnabled
      ? this.swUpdate.versionUpdates.pipe(
          map((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
          map((updateReady) => {
            this.patchState({ updateReady });
          }),
        )
      : EMPTY,
  );

  openReloadAppSnackbar() {
    this.effect(() =>
      this.snackBar
        .open(`App update avalable! Reload?`, 'OK', {
          duration: 15000,
        })
        .onAction()
        .pipe(
          tap(() =>
            this.swUpdate
              .activateUpdate()
              .then(() => document.location.reload()),
          ),
        ),
    );
  }
}
