import { createReducer, on, Action } from '@ngrx/store';
import * as featureActions from '../actions';

export interface State {
  count: number;
}

const initialState: State = {
  count: 0,
};

const featureReducer = createReducer(
  initialState,
  on(featureActions.incrementCount, (state) => ({
    ...state,
    count: state.count + 1,
  })),
  on(featureActions.decrementCount, (state) => ({
    ...state,
    count: state.count - 1,
  })),
  on(featureActions.setCount, (state, { count }) => ({ ...state, count })),
);

export function reducer(state: State | undefined, action: Action) {
  return featureReducer(state, action);
}

export const getCount = (state: State) => state.count;
