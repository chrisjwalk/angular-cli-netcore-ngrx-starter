import { createSelector, createFeatureSelector, ActionReducer } from '@ngrx/store';
import * as fromForecasts from './forecast.reducer';
import * as fromRoot from 'app/core/store/reducers';
import { WeatherForecast } from 'app/forecasts/models/weather-forecast';

export interface ForecastsState {
  forecasts: fromForecasts.State;
}

export interface State extends fromRoot.State {
  'forecasts': ForecastsState;
}

export const reducers = {
  forecasts: fromForecasts.reducer
};

export const getForecastsState = createFeatureSelector<ForecastsState>('forecasts');
export const getForecastEntitiesState = createSelector(
  getForecastsState,
  (state: ForecastsState) => state.forecasts
);
export const {
  selectIds: getForecastIds,
  selectEntities: getForecastEntities,
  selectAll: getAllForecasts,
  selectTotal: getTotalForecasts,
} = fromForecasts.adapter.getSelectors(getForecastEntitiesState);

export const getForecasts = createSelector(
  getForecastEntities,
  getForecastIds,
  (entities, ids) => {
    return (ids as string[]).map(id => entities[id]);
  }
);
export const getQuery = createSelector(
  getForecastEntitiesState,
  fromForecasts.getQuery
);
export const getLoading = createSelector(
  getForecastEntitiesState,
  fromForecasts.getLoading
);
export const getError = createSelector(
  getForecastEntitiesState,
  fromForecasts.getError
);


