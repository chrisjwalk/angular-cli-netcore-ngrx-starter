import { expect, test } from '@playwright/test';

test.describe('Content page', () => {
  test('should load the content component', async ({ page }) => {
    await page.goto('/content');

    await expect(page.getByTestId('app-content')).toBeVisible();
  });

  test('should render the page title from frontmatter', async ({ page }) => {
    await page.goto('/content');

    await expect(
      page.getByRole('heading', { name: /content pages/i }),
    ).toBeVisible();
  });

  test('should display the table of contents', async ({ page }) => {
    await page.goto('/content');

    await expect(
      page.getByRole('navigation', { name: /on this page/i }),
    ).toBeVisible();
  });

  test('should display the content files panel', async ({ page }) => {
    await page.goto('/content');

    await expect(page.getByText(/content files in this app/i)).toBeVisible();
  });
});
