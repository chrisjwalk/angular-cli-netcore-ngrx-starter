import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { AuthStore } from '@myorg/auth';
import {
  LayoutStore,
  MainToolbarComponent,
  SidenavComponent,
  SwUpdateStore,
} from '@myorg/shared';

@Component({
  imports: [
    RouterModule,
    MatSidenavModule,
    SidenavComponent,
    MainToolbarComponent,
    MatSnackBarModule,
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
export class AppComponent {
  readonly swUpdateStore = inject(SwUpdateStore);
  readonly store = inject(LayoutStore);
  readonly authStore = inject(AuthStore);
}
