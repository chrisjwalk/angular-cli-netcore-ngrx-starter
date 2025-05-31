import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-page-toolbar',
  template: `
    @if (title()) {
      <h1 class="text-lg font-normal inline">{{ title() }}</h1>
    }
    <span class="flex-1"></span>
    <ng-content />
  `,
  host: {
    class:
      'bg-white/95 dark:bg-neutral-700 flex flex-row whitespace-nowrap gap-2 py-0 px-4 box-border items-center h-[46px]',
    'data-testid': 'lib-page-toolbar',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageToolbar {
  title = input<string>(null);
}
