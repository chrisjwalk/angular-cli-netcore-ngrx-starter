import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MatListModule } from '@angular/material/list';

import { SidenavListItem } from './sidenav-list-item';

@Component({
  imports: [SidenavListItem, MatListModule],
  selector: 'lib-sidenav',
  template: `
    <div class="p-2">
      <mat-nav-list>
        <lib-sidenav-list-item
          (navigate)="closeSidenav.emit()"
          routerLink="/weather-forecast"
          icon="get_app"
          hint="Get Data Feature"
        >
          <span>Weather Forecasts</span>
        </lib-sidenav-list-item>
        <lib-sidenav-list-item
          (navigate)="closeSidenav.emit()"
          routerLink="/feature"
          icon="hotel"
          hint="Lazy Loaded Feature"
        >
          <span>Coutner</span>
        </lib-sidenav-list-item>
      </mat-nav-list>
    </div>
  `,
  host: {
    'data-testid': 'lib-sidenav',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidenav {
  toggleSidenav = output();
  closeSidenav = output();
}
