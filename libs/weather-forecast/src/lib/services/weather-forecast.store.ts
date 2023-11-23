import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

import { WeatherForecast } from '../models/weather-forecast';
import { WeatherForecastService } from './weather-forecast.service';

export function withWeatherForecastFeature() {
  return signalStoreFeature(
    withEntities<WeatherForecast>(),
    withState({
      error: null,
      count: null,
      loading: null,
    }),
    withComputed((store) => ({
      weatherForecasts: computed(() => store.entities()),
    })),
    withMethods((store) => {
      const weatherForecastService = inject(WeatherForecastService);
      const getForecasts = rxMethod<number>(
        pipe(
          tap((count) => patchState(store, { count, loading: true })),
          switchMap((count) =>
            weatherForecastService.getForecasts(count).pipe(
              tapResponse(
                (weatherForecasts) =>
                  patchState(
                    store,
                    setAllEntities(weatherForecasts, {
                      idKey: 'dateFormatted',
                    }),
                    {
                      loading: false,
                    },
                  ),
                (error) => patchState(store, { error, loading: false }),
              ),
            ),
          ),
        ),
      );

      return { getForecasts };
    }),
  );
}

export const WeatherForecastStore = signalStore(withWeatherForecastFeature());
