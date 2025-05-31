import { fireEvent, render, screen } from '@testing-library/angular';

import { Counter } from './counter';

describe('Counter', () => {
  test('should exist', async () => {
    await render(Counter);

    expect(screen.getByTestId('lib-counter')).toBeTruthy();
  });

  test('should render counter', async () => {
    const count = 5;
    await render(Counter, {
      componentInputs: { count },
    });

    expect(screen.getByTestId('count').innerHTML?.trim()).toBe(`${count}`);
  });

  test('should emit increment event on click', async () => {
    const count = 5;
    const increment = vi.fn();

    await render(Counter, {
      componentInputs: { count },
      componentOutputs: { increment: { emit: increment } as any },
    });

    fireEvent.click(screen.getByText('keyboard_arrow_right'));
    expect(increment).toHaveBeenCalledTimes(1);
  });
});
