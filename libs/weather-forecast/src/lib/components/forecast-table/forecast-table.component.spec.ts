import { render, screen } from '@testing-library/angular';

import { weatherForecasts } from '../../services/weather-forecast.service.spec';
import { ForecastTableComponent } from './forecast-table.component';

describe('ForecastTableComponent', () => {
  test('should exist', async () => {
    await render(ForecastTableComponent);

    expect(screen.getByTestId('lib-forecast-table')).toBeTruthy();
  });

  // Test with signal inputs disabled until issue resolved https://github.com/thymikee/jest-preset-angular/issues/2246
  xtest('should have the correct number of rows', async () => {
    await render(ForecastTableComponent, {
      componentInputs: { data: weatherForecasts },
    });

    expect(screen.getAllByTestId('table-row')).toHaveLength(
      weatherForecasts.length,
    );
  });
});
