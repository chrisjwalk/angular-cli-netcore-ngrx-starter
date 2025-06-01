import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  imports: [MatTooltip, MatIconButton],
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
    'data-testid': 'lib-page-toolbar-button',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageToolbarButton {
  tooltip = input<string>(null);
}
