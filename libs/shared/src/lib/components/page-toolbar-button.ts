import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HlmButton, HlmTooltip } from '@myorg/spartan';

@Component({
  imports: [HlmTooltip, HlmButton],
  selector: 'lib-page-toolbar-button',
  template: `
    <button
      hlmButton
      variant="ghost"
      size="icon"
      [attr.aria-label]="tooltip()"
      [hlmTooltip]="tooltip()"
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
