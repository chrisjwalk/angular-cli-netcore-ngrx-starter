import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  selector: 'lib-page-toolbar-button',
  template: `
    <button
      class="flex"
      mat-icon-button
      [attr.aria-label]="tooltip"
      [matTooltip]="tooltip"
      [matTooltipDisabled]="!tooltip"
    >
      <ng-content />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageToolbarButtonComponent {
  @Input() tooltip: string;
  @HostBinding('class') class = 'flex items-center';
}
