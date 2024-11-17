import { computed, inject, ResourceRef } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthStore } from '@myorg/auth';
import {
  patchState,
  signalStore,
  signalStoreFeature,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

import { WeatherForecast } from '../models/weather-forecast';
import { WeatherForecastService } from '../services/weather-forecast.service';

export type WeatherForecastState = {
  count: number;
  plus: boolean;
  resource: ResourceRef<WeatherForecast[]>;
};

export const weatherForecastsInitialState: WeatherForecastState = {
  count: null,
  plus: null,
  resource: null,
};

export function withWeatherForecastFeature() {
  return signalStoreFeature(
    withState(weatherForecastsInitialState),
    withComputed((store) => ({
      request: computed(() => ({
        count: store.count(),
        plus: store.plus(),
      })),
      loading: computed(() => store.resource()?.isLoading() ?? null),
      entities: computed(() => store.resource()?.value() ?? null),
      error: computed(() => store.resource()?.error() ?? null),
    })),
    withMethods((store) => ({
      getForecasts({ count, plus }: { count: number; plus: boolean }) {
        patchState(store, { count, plus });
      },
    })),
    withHooks({
      onInit(store, weatherForecastService = inject(WeatherForecastService)) {
        patchState(store, {
          resource: rxResource({
            request: store.request,
            loader: ({ request: { count, plus } }) =>
              weatherForecastService.getForecasts(count, plus),
          }),
        });
      },
    }),
  );
}

export const WeatherForecastStore = signalStore(
  withWeatherForecastFeature(),
  withHooks({
    onInit({ getForecasts }, authStore = inject(AuthStore)) {
      getForecasts({
        count: 10,
        plus: authStore.pageRequiresLogin(),
      });
    },
  }),
);
