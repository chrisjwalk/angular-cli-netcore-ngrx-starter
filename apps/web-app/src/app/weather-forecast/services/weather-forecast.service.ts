import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { Observable } from 'rxjs';

import { WeatherForecast } from '../models/weather-forecast';

@Injectable({ providedIn: 'root' })
export class WeatherForecastService extends EntityCollectionServiceBase<WeatherForecast> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('WeatherForecast', serviceElementsFactory);
  }

  public getForecasts(count: number = 10): Observable<WeatherForecast[]> {
    return this.getWithQuery({
      count: count.toString(),
    });
  }

  public refresh(count: number = 10): Observable<WeatherForecast[]> {
    this.clearCache();
    return this.getForecasts(count);
  }
}
