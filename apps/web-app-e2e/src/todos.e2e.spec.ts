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
    await form.getByPlaceholder(/add a task/i).fill('E2E test todo');
    await form.getByRole('button', { name: /add/i }).click();

    // The new todo should appear in the list
    await expect(page.getByText('E2E test todo')).toBeVisible({
      timeout: 5000,
    });
  });

  test('should toggle a todo item', async ({ page }) => {
    await page.goto('/todos');

    // Wait for todos to load
    await expect(page.getByTestId('lib-todo-list')).toBeVisible({
      timeout: 10000,
    });

    // Click the first todo's checkbox
    const firstCheckbox = page
      .getByTestId('lib-todo-list')
      .locator('input[type="checkbox"]')
      .first();
    await firstCheckbox.click();

    // The todo text should get a line-through style (completed)
    await expect(firstCheckbox).toBeChecked();
  });

  test('should remove a todo item', async ({ page }) => {
    await page.goto('/todos');

    // Wait for todos to load
    await expect(page.getByTestId('lib-todo-list')).toBeVisible({
      timeout: 10000,
    });

    // Count initial todos
    const initialCount = await page
      .getByTestId('lib-todo-list')
      .locator('li')
      .count();

    // Click the first delete button
    const firstDeleteButton = page
      .getByTestId('lib-todo-list')
      .locator('button[aria-label="Delete todo"]')
      .first();
    await firstDeleteButton.click();

    // Count should decrease by one
    await expect(async () => {
      const newCount = page
        .getByTestId('lib-todo-list')
        .locator('li')
        ;
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
