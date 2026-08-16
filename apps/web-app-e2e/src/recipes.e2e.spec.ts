import { expect, test } from '@playwright/test';

test.describe('Recipes page', () => {
  test(
    'should list the recipe catalog',
    { timeout: 60_000 },
    async ({ page }) => {
      // Capture browser console errors for debugging CI-only flakiness
      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      page.on('pageerror', (err) => consoleErrors.push(err.message));

      await page.goto('/recipes');
      // Cold-cache lazy chunk load can take longer in CI; use generous timeout
      await expect(page.getByTestId('app-recipes')).toBeVisible({
        timeout: 60_000,
      });
      await expect(
        page.getByRole('link', { name: 'NgRx SignalStore patterns' }),
      ).toBeVisible({ timeout: 60_000 });

      expect(consoleErrors, 'Browser console errors').toEqual([]);
    },
  );

  test(
    'should render a recipe page from the catalog',
    { timeout: 60_000 },
    async ({ page }) => {
      await page.goto('/recipes/signal-store');

      await expect(page.getByTestId('app-recipe')).toBeVisible({
        timeout: 60_000,
      });
      // The hero h1 repeats the title, so scope to the markdown body's container
      await expect(
        page
          .getByTestId('lib-page-container')
          .getByRole('heading', { name: /SignalStore patterns/i }),
      ).toBeVisible({ timeout: 60_000 });

      // Regression: content not found when the slug doesn't resolve
      await expect(page.getByText(/no content found/i)).toBeHidden();
    },
  );

  test(
    'should navigate from the index to a recipe and back',
    { timeout: 60_000 },
    async ({ page }) => {
      await page.goto('/recipes');
      await page
        .getByRole('link', { name: 'NgRx SignalStore patterns' })
        .click();

      await expect(page).toHaveURL(/\/recipes\/signal-store$/);

      // Scope to the page's back link — the toolbar nav also matches "Recipes"
      await page
        .getByTestId('app-recipe')
        .getByRole('link', { name: /recipes/i })
        .click();
      await expect(page.getByTestId('app-recipes')).toBeVisible();
    },
  );
});
