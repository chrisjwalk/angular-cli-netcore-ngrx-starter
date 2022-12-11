import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [MatIconModule, RouterModule],
  selector: 'app-sidenav-list-item',
  templateUrl: './sidenav-list-item.component.html',
  styleUrls: ['./sidenav-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavListItemComponent {
  @Input() icon = '';
  @Input() hint = '';
  @Input() routerLink: string | any[] = '/';
  @Output() navigate = new EventEmitter();
}
