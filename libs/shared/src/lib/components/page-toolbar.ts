import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-page-toolbar',
  template: `
    @if (title()) {
      <h1
        class="font-display text-4xl font-black tracking-tight text-on-surface"
      >
        {{ title() }}
      </h1>
    }
    <span class="flex-1"></span>
    <ng-content />
  `,
  host: {
    class:
      'flex flex-row items-center gap-4 whitespace-nowrap px-8 pt-8 pb-5 w-full max-w-[1440px] mx-auto',
    'data-testid': 'lib-page-toolbar',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageToolbar {
  title = input<string>(null);
}
