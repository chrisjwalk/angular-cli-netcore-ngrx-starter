import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideComponentStore } from '@ngrx/component-store';
import { render, screen } from '@testing-library/angular';

import { WeatherForecastStore } from '../../services/weather-forecast.store';
import { FetchDataComponent } from './fetch-data.component';

describe('FetchDataComponent', () => {
  test('should exist', async () => {
    await render(FetchDataComponent, {
      providers: [
        provideComponentStore(WeatherForecastStore),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    expect(screen.getByTestId('app-fetch-data')).toBeTruthy();
  });
});
