import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';

import { HlmCheckbox } from './hlm-checkbox.component';

@Component({
  imports: [HlmCheckbox],
  template: `
    <hlm-checkbox data-testid="test-checkbox" [checked]="true">
      Accept terms
    </hlm-checkbox>
  `,
  host: { 'data-testid': 'hlm-checkbox-host' },
})
class HlmCheckboxHost {}

describe('HlmCheckbox', () => {
  test('should render', async () => {
    await render(HlmCheckboxHost);
    expect(screen.getByTestId('hlm-checkbox-host')).toBeTruthy();
    expect(screen.getByTestId('test-checkbox')).toBeTruthy();
  });

  test('should project label content', async () => {
    await render(HlmCheckboxHost);
    expect(screen.getByText('Accept terms')).toBeTruthy();
  });
});
