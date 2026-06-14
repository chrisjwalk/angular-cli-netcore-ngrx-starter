import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
  imports: [RouterOutlet, Sidenav, MainToolbar],
  selector: 'app-root',
  template: `
    <a
      class="absolute -left-[9999px] top-0 z-[9999] py-2 px-4 bg-black text-white no-underline rounded-br focus:left-0"
      href="#main-content"
      >Skip to main content</a
    >
    @if (!store.hideToolbar()) {
      <lib-main-toolbar
        (toggleSidenav)="store.toggleSidenav()"
        (logout)="authStore.logout(authStore.pageRequiresLogin())"
        [loggedIn]="authStore.loggedIn()"
      />
    }
    <div class="flex h-full" [class.pt-14]="!store.hideToolbar()">
      <!-- Sidenav overlay -->
      @if (store.showSidenav()) {
        <div
          class="fixed inset-0 z-40 bg-black/30"
          role="presentation"
          (click)="store.closeSidenav()"
          (keydown.escape)="store.closeSidenav()"
          tabindex="0"
        ></div>
      }
      <aside
        class="fixed top-0 left-0 z-50 h-full w-64 bg-surface-container-lowest border-r border-outline-variant shadow-lg transform transition-transform duration-200 ease-in-out"
        [class.-translate-x-full]="!store.showSidenav()"
        [class.pt-14]="!store.hideToolbar()"
      >
        <lib-sidenav
          (toggleSidenav)="store.toggleSidenav()"
          (closeSidenav)="store.closeSidenav()"
        />
      </aside>
      <main
        id="main-content"
        tabindex="-1"
        class="outline-none h-full overflow-auto flex-1"
      >
        <router-outlet />
      </main>
    </div>
  `,
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
