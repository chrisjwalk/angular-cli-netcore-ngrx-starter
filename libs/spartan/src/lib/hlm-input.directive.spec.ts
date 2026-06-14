import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';

import { HlmInput } from './hlm-input.directive';

@Component({
  imports: [HlmInput],
  template: `
    <input hlmInput data-testid="test-input" id="my-input" type="text" />
    <textarea hlmInput data-testid="test-textarea" id="my-textarea"></textarea>
  `,
  host: { 'data-testid': 'hlm-input-host' },
})
class HlmInputHost {}

describe('HlmInput', () => {
  test('should render an input with hlmInput directive', async () => {
    await render(HlmInputHost);
    expect(screen.getByTestId('hlm-input-host')).toBeTruthy();
    expect(screen.getByTestId('test-input')).toBeTruthy();
  });

  test('should apply base input styling classes', async () => {
    await render(HlmInputHost);
    const input = screen.getByTestId('test-input');
    expect(input.className).toContain('flex');
    expect(input.className).toContain('h-9');
    expect(input.className).toContain('rounded-md');
    expect(input.className).toContain('border-outline-variant');
    expect(input.className).toContain('bg-background');
  });

  test('should preserve the id attribute', async () => {
    await render(HlmInputHost);
    const input = screen.getByTestId('test-input');
    expect(input.id).toBe('my-input');
  });

  test('should work on textarea elements', async () => {
    await render(HlmInputHost);
    const textarea = screen.getByTestId('test-textarea');
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea.id).toBe('my-textarea');
    expect(textarea.className).toContain('rounded-md');
  });
});
