import { ChangeDetectionStrategy, Component, output } from '@angular/core';

import { NAV_LINKS } from './nav-links';
import { SidenavListItem } from './sidenav-list-item';

@Component({
  imports: [SidenavListItem],
  selector: 'lib-sidenav',
  template: `
    <nav class="p-2 flex flex-col gap-1">
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
    </nav>
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
