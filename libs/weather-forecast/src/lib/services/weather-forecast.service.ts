import { HttpClient, httpResource } from '@angular/common/http';
import { Injectable, Signal, inject } from '@angular/core';

import { WeatherForecast } from '../models/weather-forecast';

@Injectable({ providedIn: 'root' })
export class WeatherForecastService {
  private readonly http = inject(HttpClient);

  getForecasts(count: number, plus: boolean) {
    return this.http.get<WeatherForecast[]>(
      plus ? '/api/weatherforecastsplus' : '/api/weatherforecasts',
      {
        params: { count },
      },
    );
  }

  getForecastsHttpResource(request: Signal<{ count: number; plus: boolean }>) {
    return httpResource<WeatherForecast[]>(() => ({
      url: request().plus
        ? '/api/weatherforecastsplus'
        : '/api/weatherforecasts',
      params: { count: request().count },
    }));
  }
}
