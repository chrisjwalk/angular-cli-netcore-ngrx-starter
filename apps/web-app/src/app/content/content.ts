import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  MarkdownComponent,
  injectContent,
  injectContentFiles,
} from '@analogjs/content';
import { LayoutStore } from '@myorg/shared';

interface ContentAttributes {
  title: string;
  description: string;
}

@Component({
  imports: [MarkdownComponent],
  selector: 'app-content',
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
      <div class="max-w-6xl mx-auto px-8 py-8 flex gap-12">
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
          <aside class="hidden xl:block w-52 shrink-0">
            <nav class="sticky top-8" aria-label="On this page">
              <p
                class="mb-3 text-xs font-semibold uppercase tracking-widest text-on-surface-variant"
              >
                On this page
              </p>
              <ul class="border-l border-outline-variant/30">
                @for (item of content.toc; track item.id) {
                  <li
                    class="-ml-px border-l-2 transition-colors"
                    [class.border-primary]="activeId() === item.id"
                    [class.border-transparent]="activeId() !== item.id"
                    [class.pl-3]="item.level === 2"
                    [class.pl-6]="item.level === 3"
                    [class.pl-9]="item.level === 4"
                  >
                    <a
                      href="javascript:void(0)"
                      (click)="scrollTo(item.id)"
                      class="block py-0.5 text-sm transition-colors no-underline cursor-pointer hover:text-primary"
                      [class.text-primary]="activeId() === item.id"
                      [class.font-medium]="activeId() === item.id"
                      [class.text-on-surface-variant]="activeId() !== item.id"
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
    'data-testid': 'app-content',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Content {
  private readonly layoutStore = inject(LayoutStore);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  readonly content = toSignal(
    injectContent<ContentAttributes>({ customFilename: 'about' }),
  );
  readonly contentFiles = injectContentFiles<ContentAttributes>();
  readonly activeId = signal('');

  private observer: IntersectionObserver | null = null;

  constructor() {
    this.layoutStore.setTitle('Content');

    effect(() => {
      const toc = this.content()?.toc;
      this.observer?.disconnect();
      if (!toc?.length) {
        return;
      }
      setTimeout(() => this.setupObserver(toc), 0);
    });

    this.destroyRef.onDestroy(() => this.observer?.disconnect());
  }

  scrollTo(id: string): void {
    this.activeId.set(id);
    this.document
      .getElementById(id)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private setupObserver(toc: Array<{ id: string }>): void {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const root = this.document.getElementById('main-content');

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.activeId.set(entry.target.id);
          }
        }
      },
      { root, rootMargin: '0px 0px -75% 0px', threshold: 0 },
    );

    toc.forEach(({ id }) => {
      const el = this.document.getElementById(id);
      if (el) {
        this.observer!.observe(el);
      }
    });
  }
}
