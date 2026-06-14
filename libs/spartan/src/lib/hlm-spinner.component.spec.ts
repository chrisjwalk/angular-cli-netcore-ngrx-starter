import { render, screen } from '@testing-library/angular';

import { HlmSpinner } from './hlm-spinner.component';

describe('HlmSpinner', () => {
  test('should render', async () => {
    await render(HlmSpinner);
    expect(screen.getByTestId('hlm-spinner')).toBeTruthy();
  });

  test('should render with default size', async () => {
    const { fixture } = await render(HlmSpinner);
    const svg: SVGElement = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg.style.width).toBe('20px');
    expect(svg.style.height).toBe('20px');
  });

  test('should accept custom diameter', async () => {
    await render(HlmSpinner, { componentInputs: { diameter: 32 } });
    const svg = screen.getByTestId('hlm-spinner').querySelector('svg');
    expect(svg?.style.width).toBe('32px');
  });
});
