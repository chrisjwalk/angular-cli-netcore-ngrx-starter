import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MarkdownComponent, injectContent } from '@analogjs/content';
import { LayoutStore } from '@myorg/shared';

@Component({
  imports: [AsyncPipe, MarkdownComponent],
  selector: 'app-about',
  template: `
    <div class="max-w-3xl mx-auto px-8 py-8">
      <div class="doc-prose prose max-w-none">
        @if (content$ | async; as content) {
          <analog-markdown [content]="content.content" />
        }
      </div>
    </div>
  `,
  host: {
    class: 'block',
    'data-testid': 'app-about',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  private readonly layoutStore = inject(LayoutStore);
  readonly content$ = injectContent({ customFilename: 'about' });

  constructor() {
    this.layoutStore.setTitle('About');
  }
}
