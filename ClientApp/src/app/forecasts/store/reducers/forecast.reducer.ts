import { HttpErrorResponse } from '@angular/common/http';
import { WeatherForecast } from 'app/forecasts/models/weather-forecast';
import { ForecastActionTypes, ForecastActions } from 'app/forecasts/store/actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';

export interface State extends EntityState<WeatherForecast> {
  loading: boolean;
  loaded: boolean;
  error: HttpErrorResponse | any;
  count: number;
}
export const adapter = createEntityAdapter<WeatherForecast>({
  selectId: (forecast: WeatherForecast) => forecast.id,
  sortComparer: false
});
export const initialState: State = adapter.getInitialState({
  loading: true,
  loaded: false,
  error: '',
  count: 0
});

export function reducer(state = initialState, action: ForecastActions): State {
  switch (action.type) {
    case ForecastActionTypes.Load: {
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
        count: action.payload
      };
    }
    case ForecastActionTypes.Refresh: {
      return {
        ...state,
        error: null,
        count: action.payload
      };
    }
    case ForecastActionTypes.LoadComplete: {
      return {
        ...adapter.addAll(action.payload, state),
        loading: false,
        loaded: true,
        error: null,
        count: state.count,
      };
    }

    case  ForecastActionTypes.LoadError: {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    }

    default: {
      return state;
    }
  }
}

export const getCount = (state: State) => state.count;
export const getLoading = (state: State) => state.loading;
export const getError = (state: State) => state.error;
