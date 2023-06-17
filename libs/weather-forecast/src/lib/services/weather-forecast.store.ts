import { Injectable, inject } from '@angular/core';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { EMPTY, Observable, catchError, switchMap, tap } from 'rxjs';

import { WeatherForecastState } from '../models/weather-forecast';
import { WeatherForecastService } from './weather-forecast.service';

@Injectable()
export class WeatherForecastStore
  extends ComponentStore<WeatherForecastState>
  implements OnStoreInit
{
  private weatherForecastService = inject(WeatherForecastService);

  readonly weatherForecasts$ = this.select((state) => state?.weatherForecasts);
  readonly count$ = this.select((state) => state?.count);
  readonly loading$ = this.select((state) => state?.loading);

  ngrxOnStoreInit() {
    this.setState({
      weatherForecasts: [],
      error: null,
      count: null,
      loading: null,
    });
  }

  readonly getForecasts = this.effect((count$: Observable<number>) => {
    return count$.pipe(
      tap((count) => this.patchState({ count, loading: true })),
      switchMap((count) =>
        this.weatherForecastService.getForecasts(count).pipe(
          tap({
            next: (weatherForecasts) =>
              this.patchState({ weatherForecasts, loading: false }),
            error: (error) => {
              console.error(error);
              this.patchState({ error, loading: false });
            },
          }),
          catchError(() => EMPTY),
        ),
      ),
    );
  });
}
