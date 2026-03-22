import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { NAV_LINKS } from './nav-links';
import { NotificationBell } from './notification-bell';
import { ThemeService } from './theme.service';

@Component({
  imports: [
    MatIcon,
    MatToolbar,
    MatTooltip,
    RouterLink,
    RouterLinkActive,
    MatIconButton,
    NotificationBell,
  ],
  selector: 'lib-main-toolbar',
  template: `
    <mat-toolbar class="app-main-toolbar fixed top-0 w-full z-50 flex gap-2">
      <span class="md:hidden flex gap-2 items-center justify-center">
        <button
          mat-icon-button
          aria-label="Toggle side menu"
          (click)="toggleSidenav.emit()"
        >
          <mat-icon>menu</mat-icon>
        </button>
      </span>
      <a
        class="no-underline flex justify-center items-center w-12"
        aria-label="Home Page"
        [routerLink]="['/']"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 223 236"
          width="32"
          role="img"
          aria-labelledby="angular-logo-title"
        >
          <title id="angular-logo-title">Angular logo</title>
          <g clip-path="url(#a)">
            <path
              fill="url(#b)"
              d="m222.077 39.192-8.019 125.923L137.387 0l84.69 39.192Zm-53.105 162.825-57.933 33.056-57.934-33.056 11.783-28.556h92.301l11.783 28.556ZM111.039 62.675l30.357 73.803H80.681l30.358-73.803ZM7.937 165.115 0 39.192 84.69 0 7.937 165.115Z"
            />
            <path
              fill="url(#c)"
              d="m222.077 39.192-8.019 125.923L137.387 0l84.69 39.192Zm-53.105 162.825-57.933 33.056-57.934-33.056 11.783-28.556h92.301l11.783 28.556ZM111.039 62.675l30.357 73.803H80.681l30.358-73.803ZM7.937 165.115 0 39.192 84.69 0 7.937 165.115Z"
            />
          </g>
          <defs>
            <linearGradient
              id="b"
              x1="49.009"
              x2="225.829"
              y1="213.75"
              y2="129.722"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#E40035" />
              <stop offset=".24" stop-color="#F60A48" />
              <stop offset=".352" stop-color="#F20755" />
              <stop offset=".494" stop-color="#DC087D" />
              <stop offset=".745" stop-color="#9717E7" />
              <stop offset="1" stop-color="#6C00F5" />
            </linearGradient>
            <linearGradient
              id="c"
              x1="41.025"
              x2="156.741"
              y1="28.344"
              y2="160.344"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#FF31D9" />
              <stop offset="1" stop-color="#FF5BE1" stop-opacity="0" />
            </linearGradient>
            <clipPath id="a">
              <path fill="#fff" d="M0 0h223v236H0z" />
            </clipPath>
          </defs>
        </svg>
      </a>
      <a class="no-underline text-on-surface font-medium" [routerLink]="['/']">
        Demo App
      </a>
      <nav class="hidden md:flex items-stretch h-full ml-2">
        @for (link of navLinks; track link.routerLink) {
          <a
            [routerLink]="link.routerLink"
            routerLinkActive="text-primary border-b-2 border-primary"
            class="no-underline text-on-surface-variant text-sm px-3 h-full flex items-center hover:text-on-surface transition-colors"
          >
            {{ link.label }}
          </a>
        }
      </nav>
      <span class="flex-1"></span>
      <button
        mat-icon-button
        (click)="themeService.toggle()"
        [matTooltip]="themeTooltip()"
        aria-label="Toggle color theme"
      >
        <mat-icon>{{ themeIcon() }}</mat-icon>
      </button>
      <lib-notification-bell />
      @if (loggedIn()) {
        <button
          mat-icon-button
          class="hidden md:inline-flex"
          (click)="logout.emit()"
          matTooltip="Log out"
          aria-label="Log out"
        >
          <mat-icon>logout</mat-icon>
        </button>
      }
    </mat-toolbar>
  `,
  styles: [
    `
      .app-main-toolbar {
        height: var(--mat-toolbar-standard-height);

        .logo {
          height: var(--mat-toolbar-standard-height);
        }
      }
    `,
  ],
  host: {
    'data-testid': 'lib-main-toolbar',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainToolbar {
  readonly themeService = inject(ThemeService);
  readonly navLinks = NAV_LINKS;

  loggedIn = input<boolean>(null);

  toggleSidenav = output<void>();
  logout = output<void>();

  readonly themeIcon = computed(() => {
    const t = this.themeService.theme();
    if (t === 'light') return 'light_mode';
    if (t === 'dark') return 'dark_mode';
    return 'brightness_auto';
  });

  readonly themeTooltip = computed(() => {
    const t = this.themeService.theme();
    if (t === 'light') return 'Theme: Light (click for Dark)';
    if (t === 'dark') return 'Theme: Dark (click for System)';
    return 'Theme: System (click for Light)';
  });
}
