import { expect, test } from '@playwright/test';

test.describe('Login page', () => {
  test('should load the login page', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByTestId('lib-login')).toBeVisible();
  });

  test('should display email and password fields', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('should display a Login button', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
  });

  test('login button should be disabled when form is invalid', async ({
    page,
  }) => {
    await page.goto('/login');

    // Clear the pre-filled email so the form becomes invalid
    await page.getByLabel('Email').fill('');

    await expect(page.getByRole('button', { name: /login/i })).toBeDisabled();
  });

  test('login button should be enabled when form is valid', async ({
    page,
  }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');

    await expect(page.getByRole('button', { name: /login/i })).toBeEnabled();
  });
});
