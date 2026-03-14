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
});
