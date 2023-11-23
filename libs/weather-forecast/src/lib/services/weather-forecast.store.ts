import { Injectable, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { setEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

import { WeatherForecast } from '../models/weather-forecast';
import { WeatherForecastService } from './weather-forecast.service';

const WeatherForecastSignalStore = signalStore(
  withEntities<WeatherForecast>(),
  withState({
    error: null,
    count: null,
    loading: null,
  }),
  withMethods((store) => {
    const weatherForecastService = inject(WeatherForecastService);
    const getForecasts = rxMethod<number>(
      pipe(
        tap((count) => patchState(store, { count, loading: true })),
        switchMap((count) =>
          weatherForecastService.getForecasts(count).pipe(
            tapResponse(
              (weatherForecasts) =>
                patchState(store, setEntities(weatherForecasts), {
                  loading: false,
                }),
              (error) => patchState(store, { error, loading: false }),
            ),
          ),
        ),
      ),
    );

    return { getForecasts };
  }),
);

@Injectable()
export class WeatherForecastStore {
  private store = new WeatherForecastSignalStore();

  readonly weatherForecasts = this.store.entities;
  readonly count = this.store.count;
  readonly loading = this.store.loading;

  readonly getForecasts = this.store.getForecasts;
}
