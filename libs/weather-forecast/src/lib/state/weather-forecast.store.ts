import { inject } from '@angular/core';
import { AuthStore } from '@myorg/auth';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  signalStoreFeature,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

import { WeatherForecast } from '../models/weather-forecast';
import { WeatherForecastService } from '../services/weather-forecast.service';

export type WeatherForecastState = {
  error: unknown;
  count: number;
  loading: boolean;
};

export const weatherForecastsInitialState: WeatherForecastState = {
  error: null,
  count: null,
  loading: null,
};

export function withWeatherForecastFeature() {
  return signalStoreFeature(
    withEntities<WeatherForecast>(),
    withState(weatherForecastsInitialState),
    withMethods(
      (store, weatherForecastService = inject(WeatherForecastService)) => ({
        getForecasts: rxMethod<{ count: number; plus: boolean }>(
          pipe(
            tap(({ count }) => patchState(store, { count, loading: true })),
            switchMap(({ count, plus }) =>
              weatherForecastService.getForecasts(count, plus).pipe(
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
                  (error) => {
                    console.error(error);
                    patchState(store, { error, loading: false });
                  },
                ),
              ),
            ),
          ),
        ),
      }),
    ),
    withHooks({
      onInit({ getForecasts }, authStore = inject(AuthStore)) {
        getForecasts({ count: 10, plus: authStore.pageRequiresLogin() });
      },
    }),
  );
}

export const WeatherForecastStore = signalStore(withWeatherForecastFeature());
