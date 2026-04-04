import { expect, test } from '@playwright/test';

test.describe('Navigation', () => {
  test.describe('toolbar (desktop)', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should navigate to weather forecast page via toolbar link', async ({
      page,
    }) => {
      await page.goto('/');

      await page.getByRole('link', { name: 'Weather Forecasts' }).click();

      await expect(page).toHaveURL(/\/weather-forecast/);
      await expect(page.getByTestId('lib-weather-forecast')).toBeVisible();
    });

    test('should navigate to counter page via toolbar link', async ({
      page,
    }) => {
      await page.goto('/');

      await page.getByRole('link', { name: 'Counter' }).click();

      await expect(page).toHaveURL(/\/feature/);
      await expect(page.getByTestId('lib-counter-container')).toBeVisible();
    });

    test('should navigate home via logo link', async ({ page }) => {
      await page.goto('/feature');

      await page.getByRole('link', { name: 'Home Page' }).click();

      await expect(page).toHaveURL(/\/$/);
      await expect(page.getByTestId('lib-home')).toBeVisible();
    });
  });

  test.describe('sidenav (mobile)', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('should open sidenav and navigate to weather forecast', async ({
      page,
    }) => {
      await page.goto('/');

      await page.getByRole('button', { name: 'Toggle side menu' }).click();

      await expect(page.getByTestId('lib-sidenav')).toBeVisible();

      await page.getByRole('link', { name: /weather forecasts/i }).click();

      await expect(page).toHaveURL(/\/weather-forecast/);
    });

    test('should open sidenav and navigate to counter', async ({ page }) => {
      await page.goto('/');

      await page.getByRole('button', { name: 'Toggle side menu' }).click();

      await expect(page.getByTestId('lib-sidenav')).toBeVisible();

      await page.getByRole('link', { name: /counter/i }).click();

      await expect(page).toHaveURL(/\/feature/);
    });
  });
});
