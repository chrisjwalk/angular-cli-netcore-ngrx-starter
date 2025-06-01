import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatSidenav, MatSidenavContainer } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { AuthStore } from '@myorg/auth';
import {
  LayoutStore,
  MainToolbar,
  Sidenav,
  SwUpdateStore,
} from '@myorg/shared';

@Component({
  imports: [
    RouterOutlet,
    MatSidenav,
    MatSidenavContainer,
    Sidenav,
    MainToolbar,
  ],
  selector: 'app-root',
  template: `
    <lib-main-toolbar
      (toggleSidenav)="store.toggleSidenav()"
      (logout)="authStore.logout(authStore.pageRequiresLogin())"
      [loggedIn]="authStore.loggedIn()"
    />
    <mat-sidenav-container fullscreen>
      <mat-sidenav
        mode="over"
        [opened]="store.showSidenav()"
        (openedChange)="store.setShowSidenav($event)"
      >
        <lib-sidenav
          (toggleSidenav)="store.toggleSidenav()"
          (closeSidenav)="store.closeSidenav()"
        />
      </mat-sidenav>
      <router-outlet />
    </mat-sidenav-container>
  `,
  styles: [
    `
      .mat-drawer-container {
        margin-top: var(--mat-toolbar-standard-height);
        height: calc(100% - var(--mat-toolbar-standard-height));
      }
    `,
  ],
  host: {
    'data-testid': 'app-root',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SwUpdateStore],
})
export class App {
  readonly swUpdateStore = inject(SwUpdateStore);
  readonly store = inject(LayoutStore);
  readonly authStore = inject(AuthStore);
}
