import { Injectable } from '@angular/core';
import { patchState, signalStore, withState } from '@ngrx/signals';

export type CounterState = {
  count: number;
  loading: boolean;
  error: any;
};

const CounterSignalStore = signalStore(
  withState<CounterState>({ count: 0, loading: null, error: null }),
);

@Injectable()
export class CounterStore {
  private store = new CounterSignalStore();

  readonly count = this.store.count;
  readonly loading = this.store.loading;
  readonly error = this.store.error;

  readonly setCount = (count: number) => patchState(this.store, { count });

  readonly incrementCount = () =>
    patchState(this.store, (state) => ({
      ...state,
      count: state.count + 1,
    }));

  readonly decrementCount = () =>
    patchState(this.store, (state) => ({
      ...state,
      count: state.count - 1,
    }));
}
