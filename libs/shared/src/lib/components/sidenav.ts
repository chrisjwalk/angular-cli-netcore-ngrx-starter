import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MatNavList } from '@angular/material/list';

import { NAV_LINKS } from './nav-links';
import { SidenavListItem } from './sidenav-list-item';

@Component({
  imports: [SidenavListItem, MatNavList],
  selector: 'lib-sidenav',
  template: `
    <div class="p-2">
      <mat-nav-list>
        @for (link of navLinks; track link.routerLink) {
          <lib-sidenav-list-item
            (navigate)="closeSidenav.emit()"
            [routerLink]="link.routerLink"
            [icon]="link.icon"
            [hint]="link.hint"
          >
            <span>{{ link.label }}</span>
          </lib-sidenav-list-item>
        }
      </mat-nav-list>
    </div>
  `,
  host: {
    'data-testid': 'lib-sidenav',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidenav {
  readonly navLinks = NAV_LINKS;

  toggleSidenav = output();
  closeSidenav = output();
}
