import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';

import { SidenavListItemComponent } from '../sidenav-list-item/sidenav-list-item.component';

@Component({
  standalone: true,
  imports: [SidenavListItemComponent, MatListModule],
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  @Output() toggleSidenav = new EventEmitter();
  @Output() closeSidenav = new EventEmitter();
}
