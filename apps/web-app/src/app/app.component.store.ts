import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, Subscription, map, tap } from 'rxjs';

export type AppState = { updateReady: boolean };

@Injectable()
export class AppStore extends ComponentStore<AppState> {
  private swUpdate = inject(SwUpdate);
  private snackBar = inject(MatSnackBar);
  private reload: Subscription;

  constructor() {
    super({ updateReady: false });
  }

  readonly updateReady = this.effect(() =>
    this.swUpdate.isEnabled
      ? this.swUpdate.versionUpdates.pipe(
          map((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
          map((updateReady) => {
            this.patchState({ updateReady });
            if (updateReady) {
              this.reload = this.effect(() =>
                this.snackBar
                  .open(`App update avalable! Reload?`, 'OK', {
                    duration: 15000,
                  })
                  .onAction()
                  .pipe(
                    tap(async () =>
                      this.swUpdate
                        .activateUpdate()
                        .then(() => document.location.reload()),
                    ),
                  ),
              );
            }
          }),
        )
      : EMPTY,
  );
}
