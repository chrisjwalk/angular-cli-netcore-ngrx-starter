import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';

import { HlmField } from './hlm-field.component';
import { HlmInput } from './hlm-input.directive';
import { HlmLabel } from './hlm-label.directive';

@Component({
  imports: [HlmField, HlmLabel, HlmInput],
  template: `
    <hlm-field data-testid="test-field">
      <label hlmLabel for="name" data-testid="field-label">Name</label>
      <input hlmInput id="name" data-testid="field-input" />
    </hlm-field>
  `,
  host: { 'data-testid': 'hlm-field-host' },
})
class HlmFieldHost {}

describe('HlmField', () => {
  test('should render the field component', async () => {
    await render(HlmFieldHost);
    expect(screen.getByTestId('hlm-field-host')).toBeTruthy();
    expect(screen.getByTestId('test-field')).toBeTruthy();
  });

  test('should project content into the field', async () => {
    await render(HlmFieldHost);
    expect(screen.getByTestId('field-label')).toBeTruthy();
    expect(screen.getByTestId('field-input')).toBeTruthy();
  });

  test('should apply block class to the field', async () => {
    await render(HlmFieldHost);
    const field = screen.getByTestId('test-field');
    expect(field.className).toContain('block');
  });

  test('should contain a label and input that are linked', async () => {
    await render(HlmFieldHost);
    const label = screen.getByTestId('field-label');
    const input = screen.getByTestId('field-input');
    expect(label.getAttribute('for')).toBe(input.id);
  });
});
