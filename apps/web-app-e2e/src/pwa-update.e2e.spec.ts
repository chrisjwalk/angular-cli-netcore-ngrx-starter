import { test, expect } from '@playwright/test';

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
      !process.env['CI'],
      'PWA disabled in dev mode; run in CI or against production build',
    );

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
      !process.env['CI'],
      'PWA disabled in dev mode; run in CI or against production build',
    );

    // Intercept sw.js BEFORE navigation — serve normal content on first
    // fetch (registration), modified content on second fetch (update check).
    let swFetches = 0;
    await page.route('**/sw.js', async (route) => {
      swFetches++;
      const response = await route.fetch();
      if (swFetches === 2) {
        const body = await response.text();
        await route.fulfill({
          body: body + `\n// force-update-${Date.now()}`,
          headers: response.headers(),
        });
      } else {
        await route.fulfill({ response });
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
