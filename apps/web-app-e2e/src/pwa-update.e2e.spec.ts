import { readFileSync } from 'fs';
import { resolve } from 'path';

import { test, expect } from '@playwright/test';

// The Vite dev server returns HTML (SPA fallback) for /sw.js so the browser
// can't register it.  Read the real sw.js from the production build on disk
// and serve it via route interception.
const SW_JS = (() => {
  try {
    return readFileSync(
      resolve(process.cwd(), 'dist/apps/web-app/client/sw.js'),
      'utf-8',
    );
  } catch {
    return null;
  }
})();

test.describe('PWA update notification', () => {
  test('should show the notification bell in the toolbar', async ({ page }) => {
    await page.goto('/');

    // The bell is inside a fixed mat-toolbar so visible in the viewport
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

    // Click the bell to open the overlay
    await bell.locator('button').click();

    // The notification list panel should appear
    const panel = page.locator('[data-testid="lib-notification-list"]');
    await expect(panel).toBeVisible({ timeout: 5000 });

    // Should show the empty state
    await expect(panel.locator('text=No notifications')).toBeVisible();
  });

  test('should register a service worker', async ({ page }) => {
    // PWA is disabled in dev mode (devOptions.enabled: false). In CI,
    // webServer uses production builds (serve-e2e:production) which
    // generates sw.js via vite-plugin-pwa.
    test.skip(
      !process.env['CI'] || !SW_JS,
      'PWA disabled in dev mode or sw.js not found; run in CI or against production build',
    );

    // Vite dev server returns HTML for /sw.js.  Serve the real SW file.
    await page.route('**/sw.js', async (route) => {
      await route.fulfill({
        body: SW_JS!,
        headers: { 'Content-Type': 'application/javascript' },
      });
    });

    await page.goto('/');

    // Wait for the service worker to be activated
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
    // PWA is disabled in dev mode (devOptions.enabled: false). In CI,
    // webServer uses production builds (serve-e2e:production) which
    // generates sw.js via vite-plugin-pwa.
    test.skip(
      !process.env['CI'] || !SW_JS,
      'PWA disabled in dev mode or sw.js not found; run in CI or against production build',
    );

    // Intercept sw.js BEFORE navigation — serve the real SW file on first
    // fetch (registration), modified content on second fetch (update check).
    let swFetches = 0;
    await page.route('**/sw.js', async (route) => {
      swFetches++;
      if (swFetches === 2) {
        await route.fulfill({
          body: SW_JS! + `\n// force-update-${Date.now()}`,
          headers: { 'Content-Type': 'application/javascript' },
        });
      } else {
        await route.fulfill({
          body: SW_JS!,
          headers: { 'Content-Type': 'application/javascript' },
        });
      }
    });

    await page.goto('/');

    // Wait for the SW to take control
    await page.waitForFunction(
      () => navigator.serviceWorker.controller !== null,
      null,
      { timeout: 15000 },
    );

    // Trigger the SW update check
    await page.evaluate(async () => {
      const regs = await navigator.serviceWorker.getRegistrations();
      if (regs.length === 0) {
        throw new Error('No service worker registration found');
      }
      await regs[0].update();
    });

    // onNeedRefresh → NotificationStore → badge appears
    const bell = page.locator('[data-testid="lib-notification-bell"]');
    await expect(bell.locator('.mat-badge-content')).toBeVisible({
      timeout: 15000,
    });
    await expect(bell.locator('button')).toHaveAttribute(
      'aria-label',
      '1 unread notification',
    );

    // Click the bell to open the notification overlay
    await bell.locator('button').click();

    // Verify the notification list panel and content
    const panel = page.locator('[data-testid="lib-notification-list"]');
    await expect(panel).toBeVisible({ timeout: 5000 });
    await expect(panel.locator('text=App update available')).toBeVisible();
    await expect(panel.locator('text=A new version is ready')).toBeVisible();
    await expect(panel.locator('button:has-text("Reload")')).toBeVisible();
  });
});
