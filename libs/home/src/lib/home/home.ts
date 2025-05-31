import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LayoutStore, PageContainer, PageToolbar } from '@myorg/shared';
import { signalState } from '@ngrx/signals';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  imports: [MarkdownComponent, PageContainer, PageToolbar],
  selector: 'lib-home',
  template: `
    <lib-page-toolbar [title]="layoutStore.title()" />
    <lib-page-container>
      <div
        class="bg-white/95 dark:bg-neutral-700 p-4 rounded-sm flex flex-col shadow-sm"
      >
        <markdown data-testid="page-markdown" [src]="state.src()" />
      </div>
    </lib-page-container>
  `,
  host: {
    'data-testid': 'lib-home',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  readonly layoutStore = inject(LayoutStore);
  readonly state = signalState({ src: '/assets/home.md' });

  constructor() {
    this.layoutStore.setTitle('Home');
  }
}
