import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MarkdownComponent, injectContent } from '@analogjs/content';
import { LayoutStore, PageContainer } from '@myorg/shared';

interface RecipeAttributes {
  title: string;
  area: string;
  canonical?: string | string[];
  updated?: string | Date;
}

@Component({
  selector: 'app-recipe',
  imports: [PageContainer, MarkdownComponent],
  template: `
    <div
      class="border-b border-outline-variant/30 bg-surface-container-low dark:bg-surface-container"
    >
      <div class="max-w-6xl mx-auto px-8 py-10">
        <a
          href="/recipes"
          class="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary no-underline hover:underline"
        >
          ← Recipes
        </a>
        @if (content(); as content) {
          <h1
            class="mb-4 font-display text-4xl font-bold leading-snug text-on-surface md:text-5xl"
          >
            {{ content.attributes.title }}
          </h1>
          <p
            class="text-xs font-semibold uppercase tracking-widest text-primary"
          >
            {{ content.attributes.area }}
          </p>
        }
      </div>
    </div>

    <lib-page-container>
      @if (content(); as content) {
        <div class="doc-prose prose max-w-none">
          <analog-markdown [content]="content.content" />
        </div>
      }
    </lib-page-container>
  `,
  host: {
    class: 'block',
    'data-testid': 'app-recipe',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Recipe {
  private readonly layoutStore = inject(LayoutStore);

  readonly content = toSignal(
    injectContent<RecipeAttributes>({ param: 'slug', subdirectory: 'recipes' }),
  );

  constructor() {
    this.layoutStore.setTitle('Recipe');

    effect(() => {
      const title = this.content()?.attributes.title;
      if (title) {
        this.layoutStore.setTitle(title);
      }
    });
  }
}
