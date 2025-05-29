import { computed, inject, Signal } from '@angular/core';
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
  withFeature,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { isEqual } from 'lodash';
import { pipe, switchMap, tap } from 'rxjs';

import {
  WeatherForecast,
  WeatherForecastFilter,
} from '../models/weather-forecast';
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
    withComputed(({ count, plus }) => ({
      request: computed(() => ({
        count: count(),
        plus: plus(),
      })),
    })),
    withProps(({ weatherForecastService, request }) => ({
      weatherForecasts: rxResource({
        params: request,
        stream: ({ params: { count, plus } }) =>
          weatherForecastService.getForecasts(count, plus),
      }),
    })),

    withMethods(({ layoutStore, weatherForecasts, ...store }) => ({
      getForecasts(request: { count: number; plus: boolean }) {
        const reload = isEqual(store.request(), request);

        layoutStore.setCount(request.count);
        patchState(store, request);
        if (reload) {
          weatherForecasts.reload();
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

export function weatherForecastFilter(
  weatherForecasts: Signal<WeatherForecast[]>,
) {
  return signalStoreFeature(
    withState({
      filter: null as WeatherForecastFilter,
    }),
    withComputed((store) => ({
      filteredForecasts: computed(() =>
        weatherForecasts()?.filter(
          (forecast) =>
            (!store.filter()?.minTemperatureC ||
              forecast.temperatureC > store.filter()?.minTemperatureC) &&
            (!store.filter()?.maxTemperatureC ||
              forecast.temperatureC < store.filter()?.maxTemperatureC),
        ),
      ),
    })),
    withMethods((store) => ({
      setFilter(filter: WeatherForecastFilter) {
        patchState(store, { filter });
      },
    })),
  );
}

export const WeatherForecastStore = signalStore(
  withWeatherForecastFeature(),
  withFeature(({ weatherForecasts }) =>
    weatherForecastFilter(weatherForecasts.value),
  ),
  withWeatherForecastHooks(),
);

export type WeatherForecastStore = InstanceType<typeof WeatherForecastStore>;

export const WeatherForecastEntityStore = signalStore(
  withWeatherForecastEntitiesFeature(),
  withFeature(({ entities }) => weatherForecastFilter(entities)),
  withWeatherForecastHooks(),
);

export type WeatherForecastEntityStore = InstanceType<
  typeof WeatherForecastEntityStore
>;
