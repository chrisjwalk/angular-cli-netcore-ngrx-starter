import { expect, test } from '@playwright/test';

test.describe('Home page', () => {
  test('should load the home component', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('lib-home')).toBeVisible();
  });

  test('should render markdown content', async ({ page }) => {
    await page.goto('/');

    const markdown = page.getByTestId('page-markdown');
    await expect(markdown).toBeVisible();
    await expect(markdown).not.toBeEmpty();
  });

  test('should display the hero heading', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: /nx · angular · \.net/i }),
    ).toBeVisible();
  });
});
