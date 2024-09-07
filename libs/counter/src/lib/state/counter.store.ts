import { computed, Injectable } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, map, pipe, tap } from 'rxjs';

export type CounterState = {
  count: number;
};

export const conuterInitialState: CounterState = { count: 0 };

export const CounterStore = signalStore(
  withState(conuterInitialState),
  withMethods((store) => ({
    setCount: (count: number) => patchState(store, { count }),
    incrementCount: () =>
      patchState(store, (state) => ({
        ...state,
        count: state.count + 1,
      })),
    decrementCount: () =>
      patchState(store, (state) => ({
        ...state,
        count: state.count - 1,
      })),
  })),
  withMethods((store) => ({
    inputCount: rxMethod<number | string>(
      pipe(
        map((count) => +count),
        filter((count) => !isNaN(count)),
        tap((count) => store.setCount(+count)),
      ),
    ),
  })),
);

export type CounterStore = InstanceType<typeof CounterStore>;
