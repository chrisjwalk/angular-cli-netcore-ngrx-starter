import { createAction, props } from '@ngrx/store';
import { WeatherForecast } from 'app/forecasts/models/weather-forecast';

export const load = createAction(
  '[WeatherForecast] Load',
  props<{ count: number }>(),
);

export const refresh = createAction(
  '[WeatherForecast] Refresh',
  props<{ count: number }>(),
);

export const loadComplete = createAction(
  '[WeatherForecast] Load Complete',
  props<{ weatherForecasts: WeatherForecast[] }>(),
);

export const loadError = createAction(
  '[WeatherForecast] Load Error',
  props<{ error: string }>(),
);
