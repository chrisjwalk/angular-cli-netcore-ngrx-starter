import { expect, test } from '@playwright/test';

test.describe('Content page', () => {
  test('should load the content component', async ({ page }) => {
    await page.goto('/content');

    await expect(page.getByTestId('app-content')).toBeVisible();
  });

  test('should render the page title from frontmatter', async ({ page }) => {
    await page.goto('/content');

    await expect(
      page.getByRole('heading', { name: /content pages/i }),
    ).toBeVisible();
  });

  test('should display the table of contents', async ({ page }) => {
    await page.goto('/content');

    await expect(
      page.getByRole('navigation', { name: /on this page/i }),
    ).toBeVisible();
  });

  test('should display the content files panel', async ({ page }) => {
    await page.goto('/content');

    await expect(page.getByText(/content files in this app/i)).toBeVisible();
  });

  // Regression: content not found when filename conflicted with Analog's /_analog/content/ API path
  test('should render the markdown body without a "No Content Found" error', async ({
    page,
  }) => {
    await page.goto('/content');

    await expect(page.getByText(/no content found/i)).toBeHidden();
    await expect(
      page.getByRole('heading', { name: /how this page is built/i }),
    ).toBeVisible();
  });

  // Regression: mermaid crashed during SSR — white screen on load
  test('should not show a blank page on load', async ({ page }) => {
    await page.goto('/content');

    // Component host element must be present and contain real content
    const host = page.getByTestId('app-content');
    await expect(host).toBeVisible();
    await expect(host).not.toBeEmpty();
  });

  // Regression: <br/> tags inside <pre class="mermaid"> caused parse errors
  test('should render mermaid diagrams as SVG', async ({ page }) => {
    await page.goto('/content');

    // Mermaid runs client-side; wait up to 10 s for SVGs to appear
    await expect(page.locator('.mermaid svg').first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test('should not show a mermaid syntax error', async ({ page }) => {
    await page.goto('/content');

    // Wait for mermaid to finish rendering before asserting absence of errors
    await page.locator('.mermaid svg').first().waitFor({ timeout: 10_000 });
    await expect(page.getByText(/syntax error in text/i)).toBeHidden();
  });

  // Scroll highlight: clicking a TOC link sets it active immediately (activeId set on click)
  test('should highlight the clicked TOC link immediately', async ({
    page,
  }) => {
    await page.goto('/content');

    const toc = page.getByRole('navigation', { name: /on this page/i });
    const mermaidLink = toc.getByRole('link', { name: /mermaid diagrams/i });

    await mermaidLink.click();

    await expect(mermaidLink).toHaveClass(/font-medium/);
    await expect(mermaidLink).toHaveClass(/text-primary/);
  });

  // Scroll highlight: IntersectionObserver updates active link as the page scrolls
  test('should update the active TOC link as the page scrolls', async ({
    page,
  }) => {
    await page.goto('/content');

    // Ensure the TOC and observer are ready
    const toc = page.getByRole('navigation', { name: /on this page/i });
    await toc.waitFor();

    // Scroll the main-content container so the "Mermaid Diagrams" heading is at the top —
    // placing it inside the IntersectionObserver's top-25% effective area
    await page.evaluate(() => {
      document
        .getElementById('mermaid-diagrams')
        ?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });

    // IntersectionObserver fires asynchronously; poll until Angular updates the DOM
    const mermaidLink = toc.getByRole('link', { name: /mermaid diagrams/i });
    await expect(mermaidLink).toHaveClass(/font-medium/, { timeout: 3_000 });
  });
});
