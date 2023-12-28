import { HttpClient } from '@angular/common/http';
import { InjectionToken, inject } from '@angular/core';

import { WeatherForecast } from '../models/weather-forecast';

export const weatherForecastServiceFactory = (http = inject(HttpClient)) => ({
  getForecasts(count: number, plus: boolean) {
    return http.get<WeatherForecast[]>(
      plus ? '/api/weatherforecastsplus' : '/api/weatherforecasts',
      {
        params: { count },
      },
    );
  },
});

export const WeatherForecastService = new InjectionToken(
  'WeatherForecastService',
  {
    providedIn: 'root',
    factory: weatherForecastServiceFactory,
  },
);

export type WeatherForecastServiceApi = ReturnType<
  typeof weatherForecastServiceFactory
>;
