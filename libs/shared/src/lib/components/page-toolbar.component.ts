import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'lib-page-toolbar',
  template: `
    @if (title()) {
      <h1 class="text-lg font-normal inline">{{ title() }}</h1>
    }
    <span class="flex-1"></span>
    <ng-content />
  `,
  styles: [
    `
      :host ::ng-deep {
        .mat-mdc-form-field-subscript-wrapper {
          @apply hidden;
        }

        .mat-mdc-text-field-wrapper.mdc-text-field--outlined
          .mat-mdc-form-field-infix {
          @apply py-1 min-h-[34px];
        }
      }
    `,
  ],
  host: {
    class:
      'bg-white/95 dark:bg-neutral-700 flex flex-row whitespace-nowrap gap-2 py-0 px-4 box-border items-center h-[46px]',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageToolbarComponent {
  title = input<string>(null);
}
