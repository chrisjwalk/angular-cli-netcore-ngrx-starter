import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [MatIconModule, RouterModule, MatListModule],
  selector: 'lib-sidenav-list-item',
  template: `
    <a mat-list-item [routerLink]="routerLink" (click)="navigate.emit()">
      <mat-icon matListItemIcon>{{ icon }}</mat-icon>
      <span matListItemTitle> <ng-content /> </span>
      <span matListItemLine class="secondary">{{ hint }}</span>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavListItemComponent {
  @Input() icon = '';
  @Input() hint = '';
  @Input() routerLink: string | any[] = '/';

  @Output() navigate = new EventEmitter();
}
