import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { render, screen } from '@testing-library/angular';

import { WeatherForecastStore } from '../../services/weather-forecast.store';
import { WeatherForecastComponent } from './weather-forecast.component';

describe('WeatherForecastComponent', () => {
  test('should exist', async () => {
    await render(WeatherForecastComponent, {
      providers: [
        WeatherForecastStore,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    expect(screen.getByTestId('lib-weather-forecast')).toBeTruthy();
  });
});
