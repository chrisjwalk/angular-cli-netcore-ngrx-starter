import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect heading to exist.
  expect(
    page.getByRole('heading', { name: 'Nx + Angular + .NET' }),
  ).toBeTruthy();
});
