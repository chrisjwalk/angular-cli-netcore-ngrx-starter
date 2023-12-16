import { render, screen } from '@testing-library/angular';
import { BigButtonComponent } from './big-button.component';

describe('BigButtonComponent', () => {
  it('should render with the correct text', async () => {
    const text = 'Click me!';
    await render(`<lib-big-button>${text}</lib-big-button>`, {
      imports: [BigButtonComponent],
    });

    const button = screen.getByText(text);
    expect(button).toBeTruthy();
  });

  it('should have the correct class', async () => {
    await render(BigButtonComponent);

    const button = screen.getByTestId('lib-big-button');
    expect(button).toHaveClass('!text-base/10 !bg-neutral-900');
  });
});
