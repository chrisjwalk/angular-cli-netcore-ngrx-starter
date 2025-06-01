import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  MatListItem,
  MatListItemIcon,
  MatListItemLine,
  MatListItemTitle,
} from '@angular/material/list';
import { RouterLink } from '@angular/router';

@Component({
  imports: [
    MatIcon,
    RouterLink,
    MatListItem,
    MatListItemIcon,
    MatListItemLine,
    MatListItemTitle,
  ],
  selector: 'lib-sidenav-list-item',
  template: `
    <a mat-list-item [routerLink]="routerLink()" (click)="navigate.emit()">
      <mat-icon matListItemIcon>{{ icon() }}</mat-icon>
      <span matListItemTitle> <ng-content /> </span>
      <span matListItemLine>{{ hint() }}</span>
    </a>
  `,
  host: {
    'data-testid': 'lib-sidenav-list-item',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavListItem {
  icon = input<string>('');
  hint = input<string>('');
  routerLink = input<string | any[]>('/');

  navigate = output();
}
