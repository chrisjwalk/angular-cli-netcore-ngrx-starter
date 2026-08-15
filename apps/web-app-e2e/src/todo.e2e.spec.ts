import { expect, test } from '@playwright/test';

// Serial mode: tests mutate the shared todo API (real dev database) and
// history shows API race conditions when they run in parallel.
test.describe.configure({ mode: 'serial' });

test.describe('Todo page', () => {
  const apiTodosUrl = (url: string) => url.includes('/api/todos');

  test('should load the todo page with toolbar, form, filter, and paginator', async ({
    page,
  }) => {
    await page.goto('/todos');

    await expect(page.getByTestId('lib-todo-page')).toBeVisible();
    await expect(page.getByTestId('lib-todo-form')).toBeVisible();
    await expect(page.getByTestId('todo-filter')).toBeVisible();
    await expect(page.getByTestId('lib-todo-list')).toBeVisible();

    // The dev API seeds 12 demo todos when the table is empty, so the
    // paginator shows once the first page has loaded.
    await expect(page.locator('mat-paginator')).toBeVisible({
      timeout: 20000,
    });
  });

  test('should create a todo, filter to it, and delete it', async ({
    page,
  }) => {
    await page.goto('/todos');
    const title = `E2E ${Date.now()}`;

    await page.getByPlaceholder('What needs to be done?').fill(title);
    await page
      .getByTestId('lib-todo-form')
      .getByRole('button', { name: 'Add' })
      .click();

    const row = page.getByText(title, { exact: true });
    await expect(row).toBeVisible({ timeout: 20000 });

    // Filter to just the new todo (300ms debounce before refetch).
    await page.getByTestId('todo-filter').fill(title);
    await expect(page.getByTestId('todo-row')).toHaveCount(1, {
      timeout: 20000,
    });

    // Delete it and confirm it is gone.
    await page.getByLabel(`Delete ${title}`).click();
    await expect(page.getByText(title, { exact: true })).toHaveCount(0, {
      timeout: 20000,
    });
  });

  test('should sort by title ascending then descending', async ({ page }) => {
    await page.goto('/todos');

    const titleHeader = page.getByRole('columnheader', { name: 'Title' });
    await expect(titleHeader).toBeVisible({ timeout: 20000 });

    const readTitles = async () => {
      const titles = await page.getByTestId('todo-title').allTextContents();
      return titles.map((t) => t.trim()).filter(Boolean);
    };
    const firstTitle = async () => (await readTitles())[0];

    // First click: ascending. toPass polls until the rendered rows reflect the
    // refetch — the HTTP response resolving doesn't mean Angular has rendered.
    const initialFirst = await firstTitle();
    await titleHeader.click();
    await expect(async () => {
      expect(await firstTitle()).not.toBe(initialFirst);
    }).toPass({ timeout: 10000 });

    const ascending = await readTitles();
    expect(ascending.length).toBeGreaterThan(0);
    expect(
      ascending[0].localeCompare(ascending[ascending.length - 1]),
      `rows: ${ascending.join(' | ')}`,
    ).toBeLessThanOrEqual(0);

    // Second click: descending.
    await titleHeader.click();
    await expect(async () => {
      expect(await firstTitle()).not.toBe(ascending[0]);
    }).toPass({ timeout: 10000 });

    const descending = await readTitles();
    expect(descending.length).toBeGreaterThan(0);
    expect(
      descending[0].localeCompare(descending[descending.length - 1]),
    ).toBeGreaterThanOrEqual(0);
  });

  test('should paginate when there are more than 10 todos', async ({
    page,
  }) => {
    await page.goto('/todos');

    // Wait until the initial fetch lands — before that the count reads "0 todos".
    await expect(page.getByTestId('todo-count')).toContainText(/[1-9]/, {
      timeout: 20000,
    });
    const countText = await page.getByTestId('todo-count').textContent();
    const totalCount = Number(countText?.match(/(\d+)/)?.[1]);
    test.skip(
      totalCount <= 10,
      `only ${totalCount} todos — pagination not exercisable`,
    );

    const firstTitleOnPageOne = (
      await page.getByTestId('todo-title').first().textContent()
    )?.trim();

    await page.getByRole('button', { name: 'Next page' }).click();
    await expect(async () => {
      const firstTitleOnPageTwo = (
        await page.getByTestId('todo-title').first().textContent()
      )?.trim();
      expect(firstTitleOnPageTwo).toBeTruthy();
      expect(
        firstTitleOnPageTwo,
        `page-one first: ${firstTitleOnPageOne}, page-two first: ${firstTitleOnPageTwo}`,
      ).not.toBe(firstTitleOnPageOne);
    }).toPass({ timeout: 10000 });
  });
});
