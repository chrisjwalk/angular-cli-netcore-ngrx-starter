import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { WeatherForecast } from '../models/weather-forecast';

@Injectable({
  providedIn: 'root',
})
export class WeatherForecastService {
  private http = inject(HttpClient);

  getForecasts(count: number) {
    return this.http.get<WeatherForecast[]>('/api/weatherforecasts', {
      params: { count },
    });
  }
}
