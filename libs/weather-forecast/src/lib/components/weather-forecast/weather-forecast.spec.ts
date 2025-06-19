import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { fireEvent, render, screen } from '@testing-library/angular';

import { AuthStore } from '@myorg/auth';
import { LayoutStore } from '@myorg/shared';
import { WeatherForecastStore } from '../../state/weather-forecast.store';
import { WeatherForecast } from './weather-forecast';

describe('WeatherForecast', () => {
  test('should exist', async () => {
    await render(WeatherForecast, {
      providers: [
        WeatherForecastStore,
        AuthStore,
        LayoutStore,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    expect(screen.getByTestId('lib-weather-forecast')).toBeTruthy();
  });

  test('should fetch forecasts when count is changed', async () => {
    const { fixture } = await render(WeatherForecast, {
      providers: [
        WeatherForecastStore,
        AuthStore,
        LayoutStore,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    const store = fixture.debugElement.injector.get(WeatherForecastStore);
    const getForecasts = vi.spyOn(store, 'getForecasts');

    const input = screen.getByPlaceholderText('Forecast Days');
    await fireEvent.input(input, { target: { value: '5' } });
    await fireEvent.keyUp(input, { key: 'Enter' });

    expect(getForecasts).toHaveBeenCalledWith(
      expect.objectContaining({
        count: 5,
        plus: null,
      }),
    );
  });

  test('should fetch forecasts when refresh button is clicked', async () => {
    const { fixture } = await render(WeatherForecast, {
      providers: [
        WeatherForecastStore,
        AuthStore,
        LayoutStore,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    const store = fixture.debugElement.injector.get(WeatherForecastStore);
    const getForecasts = vi.spyOn(store, 'getForecasts');

    const refreshButton = screen.getByRole('button', {
      name: /Get Forecasts/i,
    });
    await fireEvent.click(refreshButton);

    expect(getForecasts).toHaveBeenCalled();
  });
});
