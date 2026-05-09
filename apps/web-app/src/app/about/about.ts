import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  MarkdownComponent,
  injectContent,
  injectContentFiles,
} from '@analogjs/content';
import { LayoutStore } from '@myorg/shared';

interface AboutAttributes {
  title: string;
  description: string;
}

@Component({
  imports: [MarkdownComponent],
  selector: 'app-about',
  template: `
    @if (content(); as content) {
      <!-- Hero from frontmatter -->
      <div
        class="border-b border-outline-variant/30 bg-surface-container-low dark:bg-surface-container"
      >
        <div class="max-w-6xl mx-auto px-8 py-10">
          <p
            class="mb-3 text-xs font-semibold uppercase tracking-widest text-primary"
          >
            Analog.js Content Feature
          </p>
          <h1
            class="mb-4 font-display text-4xl font-bold leading-snug text-on-surface md:text-5xl"
          >
            {{ content.attributes.title }}
          </h1>
          <p class="max-w-xl text-base leading-relaxed text-on-surface-variant">
            {{ content.attributes.description }}
          </p>
        </div>
      </div>

      <!-- Two-column layout: content + sticky TOC sidebar -->
      <div class="max-w-6xl mx-auto px-8 py-8 flex items-start gap-12">
        <!-- Main content -->
        <div class="min-w-0 flex-1">
          <div class="doc-prose prose max-w-none">
            <analog-markdown [content]="content.content" />
          </div>

          <!-- injectContentFiles() demo -->
          @if (contentFiles.length > 0) {
            <div
              class="mt-10 rounded-lg border border-outline-variant/40 bg-surface-container-low p-4"
            >
              <p class="mb-1 text-sm font-semibold text-on-surface">
                Content files in this app
                <span class="ml-1 font-normal text-on-surface-variant"
                  >(via <code class="text-xs">injectContentFiles()</code>)</span
                >
              </p>
              <p class="mb-3 text-xs text-on-surface-variant">
                Resolved at build time — no API call needed.
              </p>
              <ul class="space-y-1">
                @for (file of contentFiles; track file.slug) {
                  <li class="text-sm">
                    <code class="text-primary">{{ file.filename }}</code>
                    @if (file.attributes.title) {
                      <span class="text-on-surface-variant">
                        — {{ file.attributes.title }}</span
                      >
                    }
                  </li>
                }
              </ul>
            </div>
          }
        </div>

        <!-- Sticky TOC sidebar -->
        @if (content.toc && content.toc.length > 0) {
          <aside
            class="hidden xl:block w-52 shrink-0"
            aria-label="On this page"
          >
            <nav
              class="sticky top-[calc(var(--mat-toolbar-standard-height)+1.5rem)]"
            >
              <p
                class="mb-3 text-xs font-semibold uppercase tracking-widest text-on-surface-variant"
              >
                On this page
              </p>
              <ul class="space-y-1 border-l border-outline-variant/40 pl-3">
                @for (item of content.toc; track item.id) {
                  <li
                    [class.pl-3]="item.level === 3"
                    [class.pl-6]="item.level === 4"
                  >
                    <a
                      [href]="'#' + item.id"
                      class="block py-0.5 text-sm text-on-surface-variant hover:text-primary transition-colors no-underline"
                      >{{ item.text }}</a
                    >
                  </li>
                }
              </ul>
            </nav>
          </aside>
        }
      </div>
    }
  `,
  host: {
    class: 'block',
    'data-testid': 'app-about',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  private readonly layoutStore = inject(LayoutStore);

  readonly content = toSignal(
    injectContent<AboutAttributes>({ customFilename: 'about' }),
  );
  readonly contentFiles = injectContentFiles<AboutAttributes>();

  constructor() {
    this.layoutStore.setTitle('About');
  }
}
