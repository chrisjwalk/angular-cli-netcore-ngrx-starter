import { render, screen } from '@testing-library/angular';

import { CounterContainerComponent } from './counter-container.component';

describe('CounterContainerComponent', () => {
  test('should exist', async () => {
    await render(CounterContainerComponent);

    expect(screen.getByTestId('lib-counter-container')).toBeTruthy();
  });
});
