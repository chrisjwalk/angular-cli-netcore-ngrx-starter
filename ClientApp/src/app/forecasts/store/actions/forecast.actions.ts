import { Action } from '@ngrx/store';

import { WeatherForecast } from 'app/forecasts/models/weather-forecast';

export enum ForecastActionTypes {
  Load = '[WeatherForecast] Load',
  Refresh = '[WeatherForecast] Refresh',
  LoadComplete = '[WeatherForecast] Load Complete',
  LoadError = '[WeatherForecast] Load Error',
}

export class Load implements Action {
  readonly type = ForecastActionTypes.Load;

  constructor(public payload: number = 10) {}
}

export class Refresh implements Action {
  readonly type = ForecastActionTypes.Refresh;

  constructor(public payload: number) {}
}

export class LoadComplete implements Action {
  readonly type = ForecastActionTypes.LoadComplete;

  constructor(public payload: WeatherForecast[]) {}
}

export class LoadError implements Action {
  readonly type = ForecastActionTypes.LoadError;

  constructor(public payload: string) {}
}

export type ForecastActions = LoadComplete | LoadError | Load | Refresh;
