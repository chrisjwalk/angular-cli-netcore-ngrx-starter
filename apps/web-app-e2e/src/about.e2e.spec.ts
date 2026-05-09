import { expect, test } from '@playwright/test';

test.describe('About page', () => {
  test('should load the about component', async ({ page }) => {
    await page.goto('/about');

    await expect(page.getByTestId('app-about')).toBeVisible();
  });

  test('should render the page title from frontmatter', async ({ page }) => {
    await page.goto('/about');

    await expect(
      page.getByRole('heading', { name: /content pages/i }),
    ).toBeVisible();
  });

  test('should display the table of contents', async ({ page }) => {
    await page.goto('/about');

    await expect(
      page.getByRole('navigation', { name: /on this page/i }),
    ).toBeVisible();
  });

  test('should display the content files panel', async ({ page }) => {
    await page.goto('/about');

    await expect(page.getByText(/content files in this app/i)).toBeVisible();
  });
});
