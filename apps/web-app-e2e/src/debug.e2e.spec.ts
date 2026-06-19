import { expect, test } from '@playwright/test';

test.describe('Debug page', () => {
  test('should load the debug page', async ({ page }) => {
    await page.goto('/debug');

    await expect(
      page.getByRole('heading', { name: /debug tools/i }),
    ).toBeVisible();
  });

  test('should display notification action buttons', async ({ page }) => {
    await page.goto('/debug');

    await expect(page.getByRole('button', { name: /add info/i })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /add error/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /add sw-update/i }),
    ).toBeVisible();
  });

  test('should add an info notification when clicking Add info', async ({
    page,
  }) => {
    await page.goto('/debug');

    // Click the "Add info" button
    await page.getByRole('button', { name: /add info/i }).click();

    // The notification bell badge should update
    const bell = page.locator('[data-testid="lib-notification-bell"]');
    await expect(bell.locator('button')).toHaveAttribute(
      'aria-label',
      '1 unread notification',
      { timeout: 3000 },
    );
  });

  test('should add multiple notifications', async ({ page }) => {
    await page.goto('/debug');

    // Add an info and an error notification
    await page.getByRole('button', { name: /add info/i }).click();
    await page.getByRole('button', { name: /add error/i }).click();

    // Badge should show 2 unread
    const bell = page.locator('[data-testid="lib-notification-bell"]');
    await expect(bell.locator('button')).toHaveAttribute(
      'aria-label',
      '2 unread notifications',
      { timeout: 3000 },
    );

    // Open the notification panel
    await bell.locator('button').click();

    const panel = page.locator('[data-testid="lib-notification-list"]');
    await expect(panel).toBeVisible({ timeout: 5000 });
    await expect(panel.locator('text=Info notification')).toBeVisible();
    await expect(panel.locator('text=Something went wrong')).toBeVisible();
  });

  test('should clear all notifications', async ({ page }) => {
    await page.goto('/debug');

    // Add a couple of notifications
    await page.getByRole('button', { name: /add info/i }).click();
    await page.getByRole('button', { name: /add error/i }).click();

    // Click "Clear all"
    await page.getByRole('button', { name: /clear all/i }).click();

    // Badge should disappear
    const bell = page.locator('[data-testid="lib-notification-bell"]');
    await expect(bell.locator('button')).toHaveAttribute(
      'aria-label',
      'Notifications',
      { timeout: 3000 },
    );
  });

  test('visual snapshot', { tag: '@visual' }, async ({ page }) => {
    await page.goto('/debug');
    await expect(
      page.getByRole('heading', { name: /debug tools/i }),
    ).toBeVisible();
    await expect(page).toHaveScreenshot('debug.png', { fullPage: true });
  });
});
