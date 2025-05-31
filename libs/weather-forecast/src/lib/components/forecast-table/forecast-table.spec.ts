import { render, screen } from '@testing-library/angular';

import { weatherForecasts } from '../../services/weather-forecast.service.spec';
import { ForecastTable } from './forecast-table';

describe('ForecastTable', () => {
  test('should exist', async () => {
    await render(ForecastTable);

    expect(screen.getByTestId('lib-forecast-table')).toBeTruthy();
  });

  test('should have the correct number of rows', async () => {
    await render(ForecastTable, {
      componentInputs: { data: weatherForecasts },
    });

    expect(screen.getAllByTestId('table-row')).toHaveLength(
      weatherForecasts.length,
    );
  });
});
