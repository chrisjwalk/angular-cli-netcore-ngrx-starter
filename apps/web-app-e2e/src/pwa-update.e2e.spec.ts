import { readFileSync } from 'fs';
import { resolve } from 'path';

import { test, expect } from '@playwright/test';

// The Vite dev server returns HTML (SPA fallback) for /sw.js so the browser
// can't register it.  Read the real sw.js from the production build on disk
// and serve it via route interception.
function loadSwJs(): string | null {
  try {
    return readFileSync(
      resolve(process.cwd(), 'dist/apps/web-app/client/sw.js'),
      'utf-8',
    );
  } catch {
    return null;
  }
}

const pwaTestsEnabled = Boolean(process.env['CI']);

test.describe('PWA update notification', () => {
  test('should show the notification bell in the toolbar', async ({ page }) => {
    await page.goto('/');

    const bell = page.locator('[data-testid="lib-notification-bell"]');
    await expect(bell).toBeVisible();
    await expect(
      bell.locator('button[aria-label="Notifications"]'),
    ).toBeVisible();
  });

  test('should open the notification overlay when bell is clicked', async ({
    page,
  }) => {
    await page.goto('/');

    const bell = page.locator('[data-testid="lib-notification-bell"]');
    await expect(bell).toBeVisible();

    await bell.locator('button').click();

    const panel = page.locator('[data-testid="lib-notification-list"]');
    await expect(panel).toBeVisible({ timeout: 5000 });

    await expect(panel.locator('text=No notifications')).toBeVisible();
  });

  test(
    'visual snapshot (notification bell)',
    { tag: '@visual' },
    async ({ page }) => {
      await page.goto('/');
      const bell = page.locator('[data-testid="lib-notification-bell"]');
      await expect(bell).toBeVisible();
      await expect(page).toHaveScreenshot('pwa-notification-bell.png', {
        fullPage: true,
      });
    },
  );

  if (pwaTestsEnabled) {
    test('should register a service worker', async ({ page }) => {
      const sw = loadSwJs();
      test.skip(!sw, 'sw.js not available');

      await page.route('**/sw.js', async (route) => {
        await route.fulfill({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          body: sw!,
          headers: { 'Content-Type': 'application/javascript' },
        });
      });

      await page.goto('/');

      await page.waitForFunction(
        () => navigator.serviceWorker.controller !== null,
        null,
        { timeout: 15000 },
      );

      const registrations = await page.evaluate(async () => {
        const regs = await navigator.serviceWorker.getRegistrations();
        return regs.length;
      });

      expect(registrations).toBeGreaterThan(0);
    });

    test('should show update notification when SW detects new version', async ({
      page,
    }) => {
      const sw = loadSwJs();
      test.skip(!sw, 'sw.js not available');

      let swFetches = 0;
      await page.route('**/sw.js', async (route) => {
        swFetches++;
        if (swFetches === 2) {
          await route.fulfill({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            body: sw! + `\n// force-update-${Date.now()}`,
            headers: { 'Content-Type': 'application/javascript' },
          });
        } else {
          await route.fulfill({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            body: sw!,
            headers: { 'Content-Type': 'application/javascript' },
          });
        }
      });

      await page.goto('/');

      await page.waitForFunction(
        () => navigator.serviceWorker.controller !== null,
        null,
        { timeout: 15000 },
      );

      await page.evaluate(async () => {
        const regs = await navigator.serviceWorker.getRegistrations();
        if (regs.length === 0) {
          throw new Error('No service worker registration found');
        }
        await regs[0].update();
      });

      const bell = page.locator('[data-testid="lib-notification-bell"]');
      await expect(bell.locator('button span.absolute')).toBeVisible({
        timeout: 15000,
      });
      await expect(bell.locator('button')).toHaveAttribute(
        'aria-label',
        '1 unread notification',
      );

      await bell.locator('button').click();

      const panel = page.locator('[data-testid="lib-notification-list"]');
      await expect(panel).toBeVisible({ timeout: 5000 });
      await expect(panel.locator('text=App update available')).toBeVisible();
      await expect(panel.locator('text=A new version is ready')).toBeVisible();
      await expect(panel.locator('button:has-text("Reload")')).toBeVisible();
    });
  }
});
