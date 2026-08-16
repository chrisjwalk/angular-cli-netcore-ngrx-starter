import { of } from 'rxjs';
import { provideContent, withMarkdownRenderer } from '@analogjs/content';
import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';

import { Recipe } from './recipe';

vi.mock('@analogjs/content', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@analogjs/content')>();
  return {
    ...actual,
    injectContent: () =>
      of({
        filename: 'recipes/signal-store',
        slug: 'recipes/signal-store',
        content: '# Recipe body',
        attributes: { title: 'NgRx SignalStore patterns', area: 'frontend' },
      }),
  };
});

describe('Recipe', () => {
  const renderRecipe = () =>
    render(Recipe, {
      providers: [provideRouter([]), provideContent(withMarkdownRenderer())],
    });

  it('should create', async () => {
    await renderRecipe();
    expect(screen.getByTestId('app-recipe')).toBeTruthy();
  });

  it('should render the recipe title from frontmatter', async () => {
    await renderRecipe();
    expect(
      screen.getByRole('heading', { name: 'NgRx SignalStore patterns' }),
    ).toBeTruthy();
  });

  it('should render the markdown body', async () => {
    await renderRecipe();
    expect(screen.getByText(/Recipe body/)).toBeTruthy();
  });
});
