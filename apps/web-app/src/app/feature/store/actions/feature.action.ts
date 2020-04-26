import { createAction, props } from '@ngrx/store';

export const setCount = createAction(
  '[Feature] Set Count',
  props<{ count: number }>(),
);
export const incrementCount = createAction('[Feature] Increment Count');
export const decrementCount = createAction('[Feature] Decrement Count');
