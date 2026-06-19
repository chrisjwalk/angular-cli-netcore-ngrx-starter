import { test, expect } from '@playwright/test';

// E2E test for the counter MFE route
test.describe('Counter Feature E2E', () => {
  test('should increment and decrement the counter value when buttons are clicked', async ({
    page,
  }) => {
    // Go to the MFE counter route
    await page.goto('/mfe-counter');

    // Get the count element and initial value
    const countLocator = page.locator('[data-testid="count"]');
    const initial = parseInt((await countLocator.textContent()) || '0', 10);

    const counter = page.locator('[data-testid="lib-counter"]');
    const incrementButton = counter.getByLabel('Increment');
    const decrementButton = counter.getByLabel('Decrement');

    await incrementButton.click();
    await expect(countLocator).toHaveText(String(initial + 1));

    await decrementButton.click();
    await expect(countLocator).toHaveText(String(initial));
  });

  test('visual snapshot', { tag: '@visual' }, async ({ page }) => {
    await page.goto('/mfe-counter');
    await expect(page.locator('[data-testid="lib-counter"]')).toBeVisible();
    await expect(page).toHaveScreenshot('counter.png', { fullPage: true });
  });
});
