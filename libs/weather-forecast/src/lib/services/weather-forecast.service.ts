import { HttpClient, httpResource } from '@angular/common/http';
import { InjectionToken, Signal, inject } from '@angular/core';

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
  getForecastsResource(request: Signal<{ count: number; plus: boolean }>) {
    return httpResource<WeatherForecast[]>(() => ({
      url: request().plus
        ? '/api/weatherforecastsplus'
        : '/api/weatherforecasts',
      params: { count: request().count },
    }));
  },
});

export const WeatherForecastService = new InjectionToken(
  'WeatherForecastService',
  {
    providedIn: 'root',
    factory: weatherForecastServiceFactory,
  },
);

export type WeatherForecastService = ReturnType<
  typeof weatherForecastServiceFactory
>;
