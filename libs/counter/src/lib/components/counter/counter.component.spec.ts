import { fireEvent, render, screen } from '@testing-library/angular';

import { CounterComponent } from './counter.component';

describe('CounterComponent', () => {
  test('should exist', async () => {
    await render(CounterComponent);

    expect(screen.getByTestId('lib-counter')).toBeTruthy();
  });

  xtest('should render counter', async () => {
    const count = 5;
    await render(CounterComponent, {
      componentInputs: { count },
    });

    expect(screen.getByTestId('count').innerHTML?.trim()).toBe(`${count}`);
  });

  xtest('should emit increment event on click', async () => {
    const count = 5;
    const increment = jest.fn();

    await render(CounterComponent, {
      componentInputs: { count, increment: { emit: increment } as any },
    });

    fireEvent.click(screen.getByText('keyboard_arrow_right'));
    expect(increment).toHaveBeenCalledTimes(1);
  });
});
