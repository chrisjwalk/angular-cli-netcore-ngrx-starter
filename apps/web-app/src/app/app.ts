import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSidenav, MatSidenavContainer } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AuthStore } from '@myorg/auth';
import {
  LayoutStore,
  MainToolbar,
  Sidenav,
  SwUpdateStore,
} from '@myorg/shared';
import { filter } from 'rxjs/operators';

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
    <a class="skip-link" href="#main-content">Skip to main content</a>
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
      <main id="main-content" tabindex="-1">
        <router-outlet />
      </main>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .mat-drawer-container {
        margin-top: var(--mat-toolbar-standard-height);
        height: calc(100% - var(--mat-toolbar-standard-height));
      }

      .skip-link {
        position: absolute;
        left: -9999px;
        top: 0;
        z-index: 9999;
        padding: 8px 16px;
        background: #000;
        color: #fff;
        text-decoration: none;
        border-radius: 0 0 4px 0;

        &:focus {
          left: 0;
        }
      }

      main {
        outline: none;
        height: 100%;
        overflow: auto;
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

  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        const main = this.document.getElementById('main-content');
        main?.focus({ preventScroll: false });
      });
  }
}
