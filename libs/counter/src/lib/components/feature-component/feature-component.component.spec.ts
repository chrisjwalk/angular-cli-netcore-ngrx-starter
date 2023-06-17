import { fireEvent, render, screen } from '@testing-library/angular';

import { FeatureComponentComponent } from './feature-component.component';

describe('Counter', () => {
  test('should render counter', async () => {
    const count = 5;
    await render(FeatureComponentComponent, {
      componentProperties: { count },
    });

    expect(screen.getByTestId('count').innerHTML).toBe(`${count}`);
  });

  test('should emit increment event on click', async () => {
    const count = 5;
    const increment = jest.fn();

    await render(FeatureComponentComponent, {
      componentProperties: { count, increment: { emit: increment } as any },
    });

    fireEvent.click(screen.getByText('keyboard_arrow_right'));
    expect(increment).toHaveBeenCalledTimes(1);
  });
});
