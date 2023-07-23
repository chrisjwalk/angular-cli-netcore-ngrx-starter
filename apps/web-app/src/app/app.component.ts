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
  LayoutService,
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
        (toggleSidenav)="layoutService.toggleSidenav()"
      ></lib-main-toolbar>
      <mat-sidenav-container class="mat-app-background" fullscreen>
        <mat-sidenav
          mode="over"
          [opened]="layoutService.showSidenav()"
          (openedChange)="sidenavChanged($event)"
          class="mat-app-background"
        >
          <lib-sidenav
            (toggleSidenav)="layoutService.toggleSidenav()"
            (closeSidenav)="layoutService.closeSidenav()"
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

      :host,
      mat-sidenav-container,
      .app-content {
        margin: 0;
        width: 100%;
        height: 100%;
      }

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
  layoutService = inject(LayoutService);

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
      this.layoutService.openSidenav();
    } else {
      this.layoutService.closeSidenav();
    }
  }
}
