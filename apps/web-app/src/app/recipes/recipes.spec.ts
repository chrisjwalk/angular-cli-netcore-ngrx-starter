import { provideContent, withMarkdownRenderer } from '@analogjs/content';
import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';

import { Recipes } from './recipes';

vi.mock('@analogjs/content', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@analogjs/content')>();
  return {
    ...actual,
    injectContentFiles: () => [
      {
        filename: '/src/content/recipes/signal-store.md',
        slug: 'signal-store',
        attributes: { title: 'NgRx SignalStore patterns', area: 'frontend' },
      },
      {
        filename: '/src/content/recipes/ef-migrations.md',
        slug: 'ef-migrations',
        attributes: {
          title: 'EF Core migrations (Identity)',
          area: 'backend',
        },
      },
    ],
  };
});

describe('Recipes', () => {
  const renderRecipes = () =>
    render(Recipes, {
      providers: [provideRouter([]), provideContent(withMarkdownRenderer())],
    });

  it('should create', async () => {
    await renderRecipes();
    expect(screen.getByTestId('app-recipes')).toBeTruthy();
  });

  it('should list recipes from the content files', async () => {
    await renderRecipes();
    expect(screen.getByText('NgRx SignalStore patterns')).toBeTruthy();
    expect(screen.getByText('EF Core migrations (Identity)')).toBeTruthy();
  });

  it('should link each recipe to its slug route', async () => {
    await renderRecipes();
    const link = screen.getByText('NgRx SignalStore patterns').closest('a');
    expect(link?.getAttribute('href')).toBe('/recipes/signal-store');
  });
});
