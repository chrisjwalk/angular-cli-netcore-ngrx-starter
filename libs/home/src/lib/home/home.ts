import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LayoutStore } from '@myorg/shared';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  imports: [MarkdownComponent],
  selector: 'lib-home',
  template: `
    <div class="max-w-3xl mx-auto px-8 py-8">
      <div class="doc-prose prose max-w-none">
        <markdown data-testid="page-markdown" [src]="markdownSrc" />
      </div>
    </div>
  `,
  host: {
    class: 'block',
    'data-testid': 'lib-home',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly layoutStore = inject(LayoutStore);
  readonly markdownSrc = '/assets/home.md';

  constructor() {
    this.layoutStore.setTitle('Home');
  }
}
