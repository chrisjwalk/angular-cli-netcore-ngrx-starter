import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  LayoutStore,
  PageContainerComponent,
  PageToolbarComponent,
} from '@myorg/shared';
import { signalState } from '@ngrx/signals';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  standalone: true,
  imports: [MarkdownComponent, PageContainerComponent, PageToolbarComponent],
  selector: 'lib-home',
  template: `
    <lib-page-toolbar [title]="layoutStore.title()" />
    <lib-page-container>
      <div
        class="bg-white/95 dark:bg-neutral-700 p-4 rounded flex flex-col shadow"
      >
        <markdown data-testid="page-markdown" [src]="state.src()" />
      </div>
    </lib-page-container>
  `,
  styles: [
    `
      :host ::ng-deep {
        markdown {
          pre {
            @apply p-4 overflow-auto rounded border text-sm border-neutral-900 bg-neutral-50;

            @media (prefers-color-scheme: dark) {
              @apply bg-neutral-900 border-neutral-50;
            }
          }

          blockquote {
            @apply py-0.5 px-4 mx-0 my-3 border-l-8 rounded border-neutral-900 bg-neutral-50;

            @media (prefers-color-scheme: dark) {
              @apply bg-neutral-900 border-neutral-50;
            }
          }

          code {
            @apply py-0.5 px-1 bg-neutral-50;

            @media (prefers-color-scheme: dark) {
              @apply bg-neutral-900;
            }
          }

          h1 {
            @apply text-3xl font-bold my-5 md:text-4xl;
          }

          h2 {
            @apply text-2xl font-bold mb-4 mt-8 md:text-3xl;
          }

          h3 {
            @apply text-xl font-bold my-3 md:text-2xl;
          }

          h4 {
            @apply text-lg font-bold my-2 md:text-lg;
          }

          p {
            @apply my-3;
          }

          ul {
            @apply list-disc pl-10;
          }
        }
      }
    `,
  ],
  host: {
    'data-testid': 'lib-home',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  readonly layoutStore = inject(LayoutStore);
  readonly state = signalState({ src: '/assets/home.component.md' });

  ngOnInit() {
    this.layoutStore.setTitle('Home');
  }
}
