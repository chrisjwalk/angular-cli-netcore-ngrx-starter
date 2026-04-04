import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LayoutStore } from '@myorg/shared';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  imports: [MarkdownComponent],
  selector: 'lib-home',
  template: `
    <!-- Hero title band -->
    <div
      class="border-b border-outline-variant/30 bg-surface-container-low dark:bg-surface-container"
    >
      <div class="max-w-3xl mx-auto px-8 py-10">
        <p
          class="mb-3 text-xs font-semibold uppercase tracking-widest text-primary"
        >
          Full-Stack Starter
        </p>
        <h1
          class="mb-4 font-display text-4xl font-bold leading-snug text-on-surface md:text-5xl"
        >
          Nx · Angular · .NET 10.0
        </h1>
        <p class="max-w-xl text-base leading-relaxed text-on-surface-variant">
          Zoneless Angular 21, NgRx Signal Store, and .NET 10.0 Web API —
          deployable to Azure as a production-ready Nx monorepo.
        </p>
      </div>
    </div>

    <!-- Prose body -->
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
