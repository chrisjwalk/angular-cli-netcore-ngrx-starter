import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

@Component({
  imports: [MatIcon, MatToolbar, MatTooltip, RouterLink, MatIconButton],
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
        >
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
      <a class="no-underline dark:!text-neutral-300" [routerLink]="['/']">
        Demo App
      </a>
      <span class="flex-1"></span>
      <div class="hidden md:flex gap-2">
        <button
          mat-icon-button
          [routerLink]="['/weather-forecast']"
          matTooltip="Get Data Feature"
          aria-label="Get Data Feature"
        >
          <mat-icon>get_app</mat-icon>
        </button>
        <button
          mat-icon-button
          [routerLink]="['/feature']"
          matTooltip="Lazy Loaded Feature"
          aria-label="Lazy Loaded Feature"
        >
          <mat-icon>hotel</mat-icon>
        </button>
        @if (loggedIn()) {
          <button
            mat-icon-button
            (click)="logout.emit()"
            matTooltip="Log out"
            aria-label="Log out"
          >
            <mat-icon>logout</mat-icon>
          </button>
        }
      </div>
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
  loggedIn = input<boolean>(null);

  toggleSidenav = output<void>();
  logout = output<void>();
}
