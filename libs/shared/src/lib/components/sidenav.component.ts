import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MatListModule } from '@angular/material/list';

import { SidenavListItemComponent } from './sidenav-list-item.component';

@Component({
  imports: [SidenavListItemComponent, MatListModule],
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  toggleSidenav = output();
  closeSidenav = output();
}
