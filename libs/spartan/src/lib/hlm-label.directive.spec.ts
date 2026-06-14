import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';

import { HlmInput } from './hlm-input.directive';
import { HlmLabel } from './hlm-label.directive';

@Component({
  imports: [HlmLabel, HlmInput],
  template: `
    <label hlmLabel for="email" data-testid="test-label">Email</label>
    <input hlmInput id="email" data-testid="test-input" />
  `,
  host: { 'data-testid': 'hlm-label-host' },
})
class HlmLabelHost {}

describe('HlmLabel', () => {
  test('should render a label with hlmLabel directive', async () => {
    await render(HlmLabelHost);
    expect(screen.getByTestId('hlm-label-host')).toBeTruthy();
    expect(screen.getByTestId('test-label')).toBeTruthy();
  });

  test('should apply base label styling classes', async () => {
    await render(HlmLabelHost);
    const label = screen.getByTestId('test-label');
    expect(label.className).toContain('text-xs');
    expect(label.className).toContain('font-semibold');
    expect(label.className).toContain('mb-1');
  });

  test('should set the for attribute correctly', async () => {
    await render(HlmLabelHost);
    const label = screen.getByTestId('test-label');
    expect(label.getAttribute('for')).toBe('email');
  });

  test('should be associable with an input via for/id', async () => {
    await render(HlmLabelHost);
    const label = screen.getByTestId('test-label');
    const input = screen.getByTestId('test-input');
    expect(label.getAttribute('for')).toBe(input.id);
  });
});
