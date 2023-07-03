import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import {
  LayoutFacade,
  MainToolbarComponent,
  SidenavComponent,
  SidenavListItemComponent,
} from '@myorg/shared';
import { map, of, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    SidenavComponent,
    MainToolbarComponent,
    SidenavListItemComponent,
    MatSnackBarModule,
  ],
  selector: 'app-root',
  template: `
    <ng-container *ngIf="{ updateReady: updateReady$ | async } as vm">
      <lib-main-toolbar
        (toggleSidenav)="layoutFacade.toggleSidenav()"
      ></lib-main-toolbar>
      <mat-sidenav-container class="mat-app-background" fullscreen>
        <mat-sidenav
          mode="over"
          [opened]="layoutFacade.showSidenav()"
          (openedChange)="sidenavChanged($event)"
          class="mat-app-background"
        >
          <lib-sidenav
            (toggleSidenav)="layoutFacade.toggleSidenav()"
            (closeSidenav)="layoutFacade.closeSidenav()"
          ></lib-sidenav>
        </mat-sidenav>
        <div class="app-content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-container>
    </ng-container>
  `,
  styles: [
    `
      @use 'variables' as vars;

      .mat-drawer-container {
        margin-top: vars.$app-main-toolbar-height;
        height: vars.$app-mat-drawer-container-height;
        background-color: vars.$app-mat-drawer-container-background-color;

        @media (prefers-color-scheme: dark) {
          background-color: vars.$app-dark-mat-drawer-container-background-color;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  layoutFacade = inject(LayoutFacade);

  private swUpdate = inject(SwUpdate);
  private snackBar = inject(MatSnackBar);

  @HostBinding('attr.data-testid') get testId() {
    return 'app-root';
  }

  updateReady$ = this.swUpdate.isEnabled
    ? this.swUpdate.versionUpdates.pipe(
        map((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        tap((updateReady) =>
          updateReady
            ? this.snackBar
                .open(`App update avalable! Reload?`, 'OK', {
                  duration: 15000,
                })
                .onAction()
                .subscribe(() =>
                  this.swUpdate
                    .activateUpdate()
                    .then(() => document.location.reload()),
                )
            : null,
        ),
      )
    : of(false);

  sidenavChanged(sidenavOpened: boolean) {
    if (sidenavOpened) {
      this.layoutFacade.openSidenav();
    } else {
      this.layoutFacade.closeSidenav();
    }
  }
}
