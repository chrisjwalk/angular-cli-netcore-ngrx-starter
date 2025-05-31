import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

@Component({
  imports: [MatIconModule, RouterModule, MatListModule],
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
