import { expect, test } from '@playwright/test';

test.describe('About page', () => {
  test('should load the about component', async ({ page }) => {
    await page.goto('/about');

    await expect(page.getByTestId('app-about')).toBeVisible();
  });

  test('should render the about heading', async ({ page }) => {
    await page.goto('/about');

    await expect(
      page.getByRole('heading', { name: /about this starter/i }),
    ).toBeVisible();
  });

  test('should display the tech stack section', async ({ page }) => {
    await page.goto('/about');

    await expect(
      page.getByRole('heading', { name: /tech stack/i }),
    ).toBeVisible();
  });
});
