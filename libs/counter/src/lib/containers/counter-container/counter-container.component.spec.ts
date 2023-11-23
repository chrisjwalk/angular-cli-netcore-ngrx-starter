import { render, screen } from '@testing-library/angular';

import { CounterStore } from '../../data-access';
import { CounterContainerComponent } from './counter-container.component';

describe('CounterContainerComponent', () => {
  test('should exist', async () => {
    await render(CounterContainerComponent, {
      providers: [CounterStore],
    });

    expect(screen.getByTestId('lib-counter-container')).toBeTruthy();
  });
});
