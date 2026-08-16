import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectContentFiles } from '@analogjs/content';
import { LayoutStore, PageContainer, PageToolbar } from '@myorg/shared';

interface RecipeAttributes {
  title: string;
  area: string;
  canonical?: string | string[];
  updated?: string | Date;
}

interface RecipeEntry {
  slug: string;
  title: string;
  area?: string;
}

@Component({
  selector: 'app-recipes',
  imports: [PageContainer, PageToolbar, RouterLink],
  template: `
    <lib-page-toolbar [title]="layoutStore.title()" />
    <lib-page-container>
      <p class="mb-6 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
        Short recipes for the patterns implemented in this repo. The code is the
        source of truth — each recipe points at its canonical implementation
        files rather than duplicating them.
      </p>
      <ul class="grid gap-3 sm:grid-cols-2">
        @for (recipe of recipes; track recipe.slug) {
          <li>
            <a
              routerLink="/recipes/{{ recipe.slug }}"
              class="block rounded-2xl border border-outline-variant/40 bg-surface-container p-4 no-underline transition-colors hover:border-primary"
            >
              <p class="mb-1 text-sm font-semibold text-on-surface">
                {{ recipe.title }}
              </p>
              @if (recipe.area) {
                <span
                  class="text-xs font-semibold uppercase tracking-widest text-primary"
                >
                  {{ recipe.area }}
                </span>
              }
            </a>
          </li>
        }
      </ul>
    </lib-page-container>
  `,
  host: {
    class: 'block',
    'data-testid': 'app-recipes',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Recipes {
  readonly layoutStore = inject(LayoutStore);

  readonly recipes: RecipeEntry[] = injectContentFiles<RecipeAttributes>()
    .filter((file) => file.slug.startsWith('recipes/'))
    .map((file) => ({
      slug: file.slug.replace(/^recipes\//, ''),
      title: file.attributes.title ?? file.slug,
      area: file.attributes.area,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));

  constructor() {
    this.layoutStore.setTitle('Recipes');
  }
}
