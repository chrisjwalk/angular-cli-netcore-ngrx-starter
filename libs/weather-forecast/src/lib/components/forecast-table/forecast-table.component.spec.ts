import { render, screen } from '@testing-library/angular';

import { weatherForecasts } from '../../services/weather-forecast.service.spec';
import { ForecastTableComponent } from './forecast-table.component';

describe('ForecastTableComponent', () => {
  test('should exist', async () => {
    await render(ForecastTableComponent, {
      componentProperties: { data: weatherForecasts },
    });

    expect(screen.getByTestId('lib-forecast-table')).toBeTruthy();
    expect(screen.getAllByTestId('table-row')).toHaveLength(
      weatherForecasts.length,
    );
  });
});
