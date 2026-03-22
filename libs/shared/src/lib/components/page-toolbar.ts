import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-page-toolbar',
  template: `
    @if (title()) {
      <h1 class="font-display text-2xl font-bold text-on-surface">
        {{ title() }}
      </h1>
    }
    <span class="flex-1"></span>
    <ng-content />
  `,
  host: {
    class: 'flex flex-row items-center gap-4 whitespace-nowrap px-6 pt-6 pb-4',
    'data-testid': 'lib-page-toolbar',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageToolbar {
  title = input<string>(null);
}
