import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  effect,
  inject,
} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { AuthStore } from '@myorg/auth';
import {
  LayoutStore,
  MainToolbarComponent,
  SidenavComponent,
  SidenavListItemComponent,
  SwUpdateStore,
} from '@myorg/shared';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    MatSidenavModule,
    SidenavComponent,
    MainToolbarComponent,
    SidenavListItemComponent,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SwUpdateStore],
})
export class AppComponent {
  @HostBinding('attr.data-testid') testid = 'app-root';

  private readonly swUpdateStore = inject(SwUpdateStore);

  readonly store = inject(LayoutStore);
  readonly authStore = inject(AuthStore);

  readonly updateReady = effect(() => {
    if (this.swUpdateStore.updateReady()) {
      this.swUpdateStore.openReloadAppSnackbar();
    }
  });
}
