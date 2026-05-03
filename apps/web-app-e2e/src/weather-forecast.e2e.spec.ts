import { expect, test } from '@playwright/test';

test.describe('Weather Forecast page', () => {
  test('should load the weather forecast component', async ({ page }) => {
    await page.goto('/weather-forecast');

    await expect(page.getByTestId('lib-weather-forecast')).toBeVisible();
  });

  test('should display page toolbar with title', async ({ page }) => {
    await page.goto('/weather-forecast');

    const toolbar = page.getByTestId('lib-page-toolbar');
    await expect(toolbar).toBeVisible();
    await expect(toolbar).toContainText(/weather/i);
  });

  test('should contain a forecast table', async ({ page }) => {
    await page.goto('/weather-forecast');

    await expect(page.getByTestId('lib-forecast-table')).toBeVisible();
  });

  test('should have a Get Forecasts button', async ({ page }) => {
    await page.goto('/weather-forecast');

    await expect(
      page.getByRole('button', { name: /get forecasts/i }),
    ).toBeVisible();
  });

  test('should fetch and display forecast rows from the API', async ({
    page,
  }) => {
    await page.goto('/weather-forecast');

    // The store's onInit hook fetches forecasts automatically.
    // Row visibility confirms the API responded successfully.
    await expect(page.getByTestId('table-row').first()).toBeVisible({
      timeout: 10000,
    });
    const rowCount = await page.getByTestId('table-row').count();
    expect(rowCount).toBeGreaterThan(0);
  });
});
