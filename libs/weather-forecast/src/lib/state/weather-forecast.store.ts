import { computed, inject, ResourceRef } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthStore } from '@myorg/auth';
import { LayoutStore, withLoadingFeature } from '@myorg/shared';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  signalStoreFeature,
  withComputed,
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
  count: number;
  plus: boolean;
};

export const weatherForecastsInitialState: WeatherForecastState = {
  count: null,
  plus: null,
};

export function withWeatherForecastEntitiesFeature() {
  return signalStoreFeature(
    withLoadingFeature(),
    withEntities<WeatherForecast>(),
    withState(weatherForecastsInitialState),
    withMethods(
      (store, weatherForecastService = inject(WeatherForecastService)) => ({
        getForecasts: rxMethod<{ count: number; plus: boolean }>(
          pipe(
            tap(({ count, plus }) =>
              patchState(store, { count, plus, loading: true }),
            ),
            switchMap(({ count, plus }) =>
              weatherForecastService.getForecasts(count, plus).pipe(
                tapResponse(
                  (weatherForecasts) =>
                    patchState(
                      store,
                      setAllEntities(weatherForecasts, {
                        selectId: (weatherForecast) =>
                          weatherForecast.dateFormatted,
                      }),
                      {
                        loading: false,
                      } as any,
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
  );
}

export function withWeatherForecastFeature() {
  let weatherForecastResource: ResourceRef<WeatherForecast[]>;

  return signalStoreFeature(
    withState(weatherForecastsInitialState),
    withComputed((store) => ({
      request: computed(() => ({
        count: store.count(),
        plus: store.plus(),
      })),
      loading: computed(() => weatherForecastResource?.isLoading() ?? null),
      entities: computed(() => weatherForecastResource?.value() ?? []),
      error: computed(() => weatherForecastResource?.error() ?? null),
      status: computed(() => weatherForecastResource?.status() ?? null),
    })),
    withMethods(
      (
        store,
        layoutStore = inject(LayoutStore),
        weatherForecastService = inject(WeatherForecastService),
      ) => ({
        getForecasts({ count, plus }: { count: number; plus: boolean }) {
          layoutStore.setCount(count);
          patchState(store, { count, plus });
        },
        setResource() {
          weatherForecastResource = rxResource({
            request: store.request,
            loader: ({ request: { count, plus } }) =>
              weatherForecastService.getForecasts(count, plus),
          });
        },
      }),
    ),
    withHooks({
      onInit(store) {
        store.setResource();
      },
    }),
  );
}

export const WeatherForecastStore = signalStore(
  withWeatherForecastFeature(),
  withHooks({
    onInit(
      { getForecasts },
      authStore = inject(AuthStore),
      layoutStore = inject(LayoutStore),
    ) {
      getForecasts({
        count: layoutStore.count(),
        plus: authStore.pageRequiresLogin(),
      });
    },
  }),
);
