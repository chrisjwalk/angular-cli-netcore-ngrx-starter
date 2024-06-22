import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  selector: 'lib-page-toolbar-button',
  template: `
    <button
      class="flex"
      mat-icon-button
      [attr.aria-label]="tooltip()"
      [matTooltip]="tooltip()"
      [matTooltipDisabled]="!tooltip()"
    >
      <ng-content />
    </button>
  `,
  host: {
    class: 'flex items-center',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageToolbarButtonComponent {
  tooltip = input<string>(null);
}
