import { Action, createReducer, on } from '@ngrx/store';

import * as layoutActions from '../actions';

export interface State {
  showSidenav: boolean;
  title: string;
}

const initialState: State = {
  showSidenav: false,
  title: 'Home',
};

const layoutReducer = createReducer(
  initialState,
  on(layoutActions.closeSidenav, (state) => ({
    ...state,
    showSidenav: false,
  })),
  on(layoutActions.openSidenav, (state) => ({
    ...state,
    showSidenav: true,
  })),
  on(layoutActions.toggleSidenav, (state) => ({
    ...state,
    showSidenav: !state.showSidenav,
  })),
  on(layoutActions.setTitle, (state, { title }) => ({
    ...state,
    title,
  })),
);

export function reducer(state: State | undefined, action: Action) {
  return layoutReducer(state, action);
}

export const getShowSidenav = (state: State) => state.showSidenav;
export const getTitle = (state: State) => state.title;
