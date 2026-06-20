import { expect, test } from '@playwright/test';

test.describe('Navigation', () => {
  test.describe('toolbar (desktop)', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should navigate to weather forecast page via toolbar link', async ({
      page,
    }) => {
      await page.goto('/');

      // Scope to toolbar only — the sidenav also has a "Weather Forecasts" link
      await page
        .getByTestId('lib-main-toolbar')
        .getByRole('link', { name: /weather forecasts/i })
        .click();

      await expect(page).toHaveURL(/\/weather-forecast/);
      await expect(page.getByTestId('lib-weather-forecast')).toBeVisible();
    });

    test('should navigate to counter page via toolbar link', async ({
      page,
    }) => {
      await page.goto('/');

      // Scope to toolbar only — the sidenav also has a "Counter" link
      await page
        .getByTestId('lib-main-toolbar')
        .getByRole('link', { name: /counter/i })
        .click();

      await expect(page).toHaveURL(/\/mfe-counter/);
      await expect(page.getByTestId('lib-counter-container')).toBeVisible();
    });

    test('should navigate home via logo link', async ({ page }) => {
      await page.goto('/mfe-counter');

      await page.getByRole('link', { name: 'Home Page' }).click();

      await expect(page).toHaveURL(/\/$/);
      await expect(page.getByTestId('lib-home')).toBeVisible();
    });

    test('visual snapshot (desktop)', { tag: '@visual' }, async ({ page }) => {
      await page.goto('/');
      await expect(page.getByTestId('lib-home')).toBeVisible();
      await expect(page).toHaveScreenshot('navigation-desktop.png', {
        fullPage: true,
      });
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

      await expect(page).toHaveURL(/\/mfe-counter/);
    });

    test('visual snapshot (mobile)', { tag: '@visual' }, async ({ page }) => {
      await page.goto('/');
      await expect(page.getByTestId('lib-home')).toBeVisible();
      await expect(page).toHaveScreenshot('navigation-mobile.png', {
        fullPage: true,
      });
    });

    test(
      'visual snapshot (mobile sidenav open)',
      { tag: '@visual' },
      async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Toggle side menu' }).click();
        await expect(page.getByTestId('lib-sidenav')).toBeVisible();
        await expect(page).toHaveScreenshot(
          'navigation-mobile-sidenav-open.png',
          {
            fullPage: true,
          },
        );
      },
    );
  });
});
