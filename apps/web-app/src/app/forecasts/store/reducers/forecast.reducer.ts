import { HttpErrorResponse } from '@angular/common/http';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { WeatherForecast } from 'app/forecasts/models/weather-forecast';
import * as forecastActions from 'app/forecasts/store/actions';

export interface State extends EntityState<WeatherForecast> {
  loading: boolean;
  loaded: boolean;
  error: HttpErrorResponse | any;
  count: number;
}

export const adapter = createEntityAdapter<WeatherForecast>({
  selectId: (forecast: WeatherForecast) => forecast.id,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  loading: true,
  loaded: false,
  error: '',
  count: 0,
});

const forecastsReducer = createReducer(
  initialState,
  on(forecastActions.load, (state, { count }) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
    count,
  })),

  on(forecastActions.refresh, (state, { count }) => ({
    ...state,
    error: null,
    count,
  })),
  on(forecastActions.loadComplete, (state, { weatherForecasts }) => ({
    ...adapter.addAll(weatherForecasts, state),
    loading: false,
    loaded: true,
    error: null,
  })),

  on(forecastActions.loadError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);

export function reducer(state: State | undefined, action: Action) {
  return forecastsReducer(state, action);
}

export const getCount = (state: State) => state.count;
export const getLoading = (state: State) => state.loading;
export const getError = (state: State) => state.error;
