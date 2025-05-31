import { render, screen } from '@testing-library/angular';

import { CounterStore } from '../../state';
import { CounterContainer } from './counter-container';

describe('CounterContainer', () => {
  test('should exist', async () => {
    await render(CounterContainer, {
      providers: [CounterStore],
    });

    expect(screen.getByTestId('lib-counter-container')).toBeTruthy();
  });
});
