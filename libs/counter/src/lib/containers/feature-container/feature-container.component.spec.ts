import { render, screen } from '@testing-library/angular';

import { FeatureContainerComponent } from './feature-container.component';

describe('FeatureContainerComponent', () => {
  test('should exist', async () => {
    await render(FeatureContainerComponent);

    expect(screen.getByTestId('lib-feature-container')).toBeTruthy();
  });
});
