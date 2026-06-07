import { test, expect } from '@playwright/test';

// Guards against federation loadShare bugs (e.g. "not a function" on shared deps).
test.describe('MFE Integration', () => {
  test('should load without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/mfe-counter');

    // Give the MFE a moment to bootstrap
    await expect(page.locator('[data-testid="lib-counter"]')).toBeVisible();

    expect(errors).toHaveLength(0);
  });
});
