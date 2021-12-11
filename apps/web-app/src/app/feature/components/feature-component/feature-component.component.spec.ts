import { fireEvent, render, screen } from '@testing-library/angular';

import { SharedModule } from '../../../shared';
import { MaterialModule } from '../../../shared/material';
import { FeatureComponentComponent } from './feature-component.component';

describe('Counter', () => {
  test('should render counter', async () => {
    const count = 5;
    const { container } = await render(FeatureComponentComponent, {
      componentProperties: { count },
      imports: [MaterialModule, SharedModule],
    });

    expect(container.getElementsByClassName('count')[0].innerHTML).toBe(
      `${count}`,
    );
  });

  test('should emit increment event on click', async () => {
    const count = 5;
    const increment = jest.fn();

    await render(FeatureComponentComponent, {
      componentProperties: { count, increment: { emit: increment } as any },
      imports: [MaterialModule, SharedModule],
    });

    fireEvent.click(screen.getByText('keyboard_arrow_right'));
    expect(increment).toHaveBeenCalledTimes(1);
  });
});
