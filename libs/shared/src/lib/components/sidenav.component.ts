import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';

import { SidenavListItemComponent } from './sidenav-list-item.component';

@Component({
  standalone: true,
  imports: [SidenavListItemComponent, MatListModule],
  selector: 'lib-sidenav',
  template: `
    <div class="app-sidebar-content">
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
  styles: [
    `
      .app-sidebar-content {
        padding: 8px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  @Output() toggleSidenav = new EventEmitter();
  @Output() closeSidenav = new EventEmitter();
}
