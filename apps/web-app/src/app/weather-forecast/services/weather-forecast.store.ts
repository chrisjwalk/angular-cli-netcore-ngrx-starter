import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, Observable, catchError, switchMap, tap } from 'rxjs';

import {
  WeatherForecast,
  WeatherForecastState,
} from '../models/weather-forecast';

@Injectable({ providedIn: 'root' })
export class WeatherForecastStore extends ComponentStore<WeatherForecastState> {
  readonly weatherForecasts$ = this.select((state) => state?.weatherForecasts);
  readonly count$ = this.select((state) => state?.count);
  readonly loading$ = this.select((state) => state?.loading);

  constructor(private http: HttpClient) {
    super({ weatherForecasts: [], error: null, count: null, loading: null });
  }

  readonly getForecasts = this.effect((count$: Observable<number>) => {
    return count$.pipe(
      tap((count) => this.patchState({ count, loading: true })),
      switchMap((count) =>
        this.http
          .get<WeatherForecast[]>('/api/weatherforecasts', {
            params: { count },
          })
          .pipe(
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
