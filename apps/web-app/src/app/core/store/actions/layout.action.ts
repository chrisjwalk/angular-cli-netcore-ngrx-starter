import { createAction, props } from '@ngrx/store';

export const openSidenav = createAction('[Layout] Open Sidenav');

export const closeSidenav = createAction('[Layout] Close Sidenav');

export const toggleSidenav = createAction('[Layout] Toggle Sidenav');

export const setTitle = createAction(
  '[Layout] Set Title',
  props<{ title: string }>(),
);
