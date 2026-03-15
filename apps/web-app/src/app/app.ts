import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatSidenav, MatSidenavContainer } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AuthStore } from '@myorg/auth';
import {
  LayoutStore,
  MainToolbar,
  NotificationStore,
  Sidenav,
  SwUpdateStore,
} from '@myorg/shared';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, pipe, tap } from 'rxjs';

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
    <a
      class="absolute -left-[9999px] top-0 z-[9999] py-2 px-4 bg-black text-white no-underline rounded-br focus:left-0"
      href="#main-content"
      >Skip to main content</a
    >
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
      <main
        id="main-content"
        tabindex="-1"
        class="outline-none h-full overflow-auto"
      >
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
    `,
  ],
  host: {
    'data-testid': 'app-root',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NotificationStore, SwUpdateStore],
})
export class App {
  readonly swUpdateStore = inject(SwUpdateStore);
  readonly store = inject(LayoutStore);
  readonly authStore = inject(AuthStore);

  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);

  private readonly focusMainOnNavigation = rxMethod<NavigationEnd>(
    pipe(
      tap(() => {
        this.document
          .getElementById('main-content')
          ?.focus({ preventScroll: false });
      }),
    ),
  );

  constructor() {
    this.focusMainOnNavigation(
      this.router.events.pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
      ),
    );
  }
}
