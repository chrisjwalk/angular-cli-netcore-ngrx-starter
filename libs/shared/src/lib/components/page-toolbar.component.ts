import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'lib-page-toolbar',
  template: `
    <div class="app-page-toolbar">
      @if (title) {
        <h1 class="title">{{ title }}</h1>
      }
      <span class="flex-1"></span>
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .app-page-toolbar {
        @apply bg-white/95 dark:bg-neutral-700 flex flex-row whitespace-nowrap gap-2 py-0 px-4 box-border items-center;
        height: 46px;

        h1 {
          &.title {
            @apply text-lg font-normal inline;
          }
        }

        ::ng-deep {
          .mat-mdc-form-field-subscript-wrapper {
            @apply hidden;
          }

          .mat-mdc-text-field-wrapper.mdc-text-field--outlined
            .mat-mdc-form-field-infix {
            @apply py-1;
            min-height: 34px;
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageToolbarComponent {
  @Input() title: string;
}
