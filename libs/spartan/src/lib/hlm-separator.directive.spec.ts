import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';

import { HlmSeparator } from './hlm-separator.directive';

@Component({
  imports: [HlmSeparator],
  template: `<hr hlmSeparator data-testid="test-separator" />`,
  host: { 'data-testid': 'hlm-separator-host' },
})
class HlmSeparatorHost {}

describe('HlmSeparator', () => {
  test('should render', async () => {
    await render(HlmSeparatorHost);
    expect(screen.getByTestId('hlm-separator-host')).toBeTruthy();
    expect(screen.getByTestId('test-separator')).toBeTruthy();
  });

  test('should apply separator styling', async () => {
    await render(HlmSeparatorHost);
    const sep = screen.getByTestId('test-separator');
    expect(sep.className).toContain('shrink-0');
    expect(sep.className).toContain('bg-outline-variant');
  });
});
