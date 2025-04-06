import { computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthStore } from '@myorg/auth';
import { LayoutStore, withLoadingFeature } from '@myorg/shared';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  signalStoreFeature,
  type,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { isEqual } from 'lodash';
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
  return signalStoreFeature(
    withState(weatherForecastsInitialState),
    withProps(() => ({
      layoutStore: inject(LayoutStore),
      weatherForecastService: inject(WeatherForecastService),
    })),
    withComputed((store) => ({
      request: computed(() => ({
        count: store.count(),
        plus: store.plus(),
      })),
    })),
    withProps(({ weatherForecastService, request }) => ({
      weatherForecastResource:
        weatherForecastService.getForecastsResource(request),
    })),
    withComputed(({ weatherForecastResource }) => ({
      loading: computed(() => weatherForecastResource?.isLoading() ?? null),
      entities: computed(() => weatherForecastResource?.value() ?? []),
      error: computed(() => weatherForecastResource?.error() ?? null),
      status: computed(() => weatherForecastResource?.status() ?? null),
    })),
    withMethods(({ layoutStore, weatherForecastResource, ...store }) => ({
      getForecasts(request: { count: number; plus: boolean }) {
        const reload = isEqual(store.request(), request);

        layoutStore.setCount(request.count);
        patchState(store, request);
        if (reload) {
          weatherForecastResource.reload();
        }
      },
    })),
  );
}

export function withWeatherForecastHooks() {
  return signalStoreFeature(
    {
      methods: type<{
        getForecasts(request: { count: number; plus: boolean }): void;
      }>(),
    },
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
}

export const WeatherForecastStore = signalStore(
  withWeatherForecastFeature(),
  withWeatherForecastHooks(),
);

export type WeatherForecastStore = InstanceType<typeof WeatherForecastStore>;

export const WeatherForecastEntityStore = signalStore(
  withWeatherForecastEntitiesFeature(),
  withWeatherForecastHooks(),
);

export type WeatherForecastEntityStore = InstanceType<
  typeof WeatherForecastEntityStore
>;
