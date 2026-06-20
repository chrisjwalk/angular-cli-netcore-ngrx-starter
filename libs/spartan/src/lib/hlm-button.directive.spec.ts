import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';

import { HlmButton } from './hlm-button.directive';

@Component({
  imports: [HlmButton],
  template: `
    <button hlmButton data-testid="default-btn">Default</button>
    <button hlmButton variant="ghost" data-testid="ghost-btn">Ghost</button>
    <button hlmButton variant="default" size="icon" data-testid="icon-btn">
      <span>+</span>
    </button>
    <button
      hlmButton
      variant="destructive"
      size="lg"
      data-testid="destructive-lg-btn"
    >
      Delete
    </button>
    <a hlmButton data-testid="link-btn" href="#">Link</a>
    <button hlmButton disabled data-testid="disabled-btn">Disabled</button>
    <button hlmButton [disabled]="true" data-testid="bound-disabled-btn">
      Bound Disabled
    </button>
    <button hlmButton [disabled]="false" data-testid="bound-enabled-btn">
      Bound Enabled
    </button>
  `,
  host: { 'data-testid': 'hlm-button-host' },
})
class HlmButtonHost {}

describe('HlmButton', () => {
  test('should render a button with hlmButton directive', async () => {
    await render(HlmButtonHost);
    expect(screen.getByTestId('hlm-button-host')).toBeTruthy();
    expect(screen.getByTestId('default-btn')).toBeTruthy();
  });

  test('should apply default variant classes', async () => {
    await render(HlmButtonHost);
    const btn = screen.getByTestId('default-btn');
    expect(btn.className).toContain('bg-primary');
    expect(btn.className).toContain('text-primary-foreground');
  });

  test('should apply ghost variant classes', async () => {
    await render(HlmButtonHost);
    const btn = screen.getByTestId('ghost-btn');
    expect(btn.className).toContain('hover:bg-accent');
  });

  test('should apply icon size classes', async () => {
    await render(HlmButtonHost);
    const btn = screen.getByTestId('icon-btn');
    expect(btn.className).toContain('h-9');
    expect(btn.className).toContain('w-9');
  });

  test('should apply destructive variant and lg size', async () => {
    await render(HlmButtonHost);
    const btn = screen.getByTestId('destructive-lg-btn');
    expect(btn.className).toContain('bg-destructive');
    expect(btn.className).toContain('h-10');
  });

  test('should work on anchor elements', async () => {
    await render(HlmButtonHost);
    const link = screen.getByTestId('link-btn');
    expect(link.tagName).toBe('A');
    expect(link.className).toContain('cursor-pointer');
  });

  test('should set native disabled attribute when disabled', async () => {
    await render(HlmButtonHost);
    const btn = screen.getByTestId('disabled-btn');
    expect(btn.hasAttribute('disabled')).toBe(true);
  });

  test('should apply disabled Tailwind classes when disabled', async () => {
    await render(HlmButtonHost);
    const btn = screen.getByTestId('disabled-btn');
    expect(btn.className).toContain('disabled:cursor-default');
    expect(btn.className).toContain('disabled:opacity-50');
  });

  test('should set native disabled attribute with bound true', async () => {
    await render(HlmButtonHost);
    const btn = screen.getByTestId('bound-disabled-btn');
    expect(btn.hasAttribute('disabled')).toBe(true);
  });

  test('should not set native disabled attribute with bound false', async () => {
    await render(HlmButtonHost);
    const btn = screen.getByTestId('bound-enabled-btn');
    expect(btn.hasAttribute('disabled')).toBe(false);
  });
});
