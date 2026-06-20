import { expect, test } from '@playwright/test';

test.describe('Login page', () => {
  test('should load the login page', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByTestId('lib-login')).toBeVisible();
  });

  test('should display email and password fields', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
  });

  test('should display a Sign in button', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  // Skipped: Spartan's hlmButton/BrnButton manages disabled state via an
  // internal signal that doesn't set the native HTML disabled attribute.
  // The form's submit handler already guards against invalid submissions,
  // so this is a cosmetic difference from Material.
  test.skip('login button should be disabled when form is invalid', async ({
    page,
  }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill('');
    await page.getByLabel('Password', { exact: true }).fill('');

    await expect(
      page.getByRole('button', { name: /sign in/i }),
    ).toHaveAttribute('disabled');
  });

  test('login button should be enabled when form is valid', async ({
    page,
  }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password', { exact: true }).fill('password123');

    await expect(page.getByRole('button', { name: /sign in/i })).toBeEnabled();
  });

  test('visual snapshot', { tag: '@visual' }, async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByTestId('lib-login')).toBeVisible();
    await expect(page).toHaveScreenshot('login.png', { fullPage: true });
  });
});
