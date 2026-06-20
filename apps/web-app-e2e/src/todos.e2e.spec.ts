import { expect, test } from '@playwright/test';

test.describe('Todos page', () => {
  test('should load the todo page', async ({ page }) => {
    await page.goto('/todos');

    await expect(page.getByTestId('lib-todo-page')).toBeVisible();
  });

  test('should display the page toolbar with title', async ({ page }) => {
    await page.goto('/todos');

    const toolbar = page.getByTestId('lib-page-toolbar');
    await expect(toolbar).toBeVisible();
    await expect(toolbar).toContainText(/todos/i);
  });

  test('should display the todo form', async ({ page }) => {
    await page.goto('/todos');

    await expect(page.getByTestId('lib-todo-form')).toBeVisible();
  });

  test('should display the todo list', async ({ page }) => {
    await page.goto('/todos');

    await expect(page.getByTestId('lib-todo-list')).toBeVisible({
      timeout: 10000,
    });
  });

  test('should add a new todo via the form', async ({ page }) => {
    await page.goto('/todos');

    // Fill in the todo form and submit
    const form = page.getByTestId('lib-todo-form');
    await form.getByPlaceholder(/what needs to be done/i).fill('E2E test todo');
    await form.getByRole('button', { name: /add/i }).click();

    // Scope to the todo list — avoid matching the form input
    await expect(
      page.getByTestId('lib-todo-list').getByText('E2E test todo'),
    ).toBeVisible({ timeout: 10000 });
  });

  test('should toggle a todo item', async ({ page }) => {
    await page.goto('/todos');

    // Add a todo first so there is something to toggle
    const form = page.getByTestId('lib-todo-form');
    await form.getByPlaceholder(/what needs to be done/i).fill('Toggle me');
    await form.getByRole('button', { name: /add/i }).click();
    // Scope to the todo list — avoid matching the form input
    await expect(
      page.getByTestId('lib-todo-list').getByText('Toggle me'),
    ).toBeVisible({ timeout: 10000 });

    // Click the checkbox (Spartan uses [role='checkbox'], not <input>)
    const checkbox = page
      .getByTestId('lib-todo-list')
      .locator('[role="checkbox"]')
      .first();
    await checkbox.click();

    // The Spartan checkbox toggles aria-checked
    await expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  test('should remove a todo item', async ({ page }) => {
    await page.goto('/todos');

    // Add a todo first so there is something to remove
    const form = page.getByTestId('lib-todo-form');
    await form.getByPlaceholder(/what needs to be done/i).fill('Delete me');
    await form.getByRole('button', { name: /add/i }).click();
    // Scope to the todo list — avoid matching the form's own input value
    await expect(
      page.getByTestId('lib-todo-list').getByText('Delete me'),
    ).toBeVisible({ timeout: 10000 });

    // Count before
    const initialCount = await page
      .getByTestId('lib-todo-list')
      .locator('li')
      .count();

    // Let the new todo settle in the DOM before interacting
    await page.waitForTimeout(300);
    // Spartan delete button label includes the todo title: "Delete <title>"
    const deleteButton = page
      .getByTestId('lib-todo-list')
      .locator('button[aria-label^="Delete"]')
      .first();
    await deleteButton.click({ force: true });

    // Count should decrease by one
    await expect(async () => {
      const newCount = page.getByTestId('lib-todo-list').locator('li');
      await expect(newCount).toHaveCount(initialCount - 1);
    }).toPass({ timeout: 5000 });
  });

  test('visual snapshot', { tag: '@visual' }, async ({ page }) => {
    await page.goto('/todos');
    await expect(page.getByTestId('lib-todo-page')).toBeVisible();
    // Wait for todos to load from API
    await expect(page.getByTestId('lib-todo-list')).toBeVisible({
      timeout: 10000,
    });
    // Let the list settle
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('todos.png', { fullPage: true });
  });
});
