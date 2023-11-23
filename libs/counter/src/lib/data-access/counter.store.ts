import { Injectable } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export type CounterState = {
  count: number;
  loading: boolean;
  error: any;
};

const CounterSignalStore = signalStore(
  withState<CounterState>({ count: 0, loading: null, error: null }),
  withMethods((store) => {
    const setCount = (count: number) => patchState(store, { count });

    const incrementCount = () =>
      patchState(store, (state) => ({
        ...state,
        count: state.count + 1,
      }));

    const decrementCount = () =>
      patchState(store, (state) => ({
        ...state,
        count: state.count - 1,
      }));
    return { setCount, incrementCount, decrementCount };
  }),
);

@Injectable()
export class CounterStore {
  private store = new CounterSignalStore();

  readonly count = this.store.count;
  readonly loading = this.store.loading;
  readonly error = this.store.error;

  readonly setCount = this.store.setCount;
  readonly incrementCount = this.store.incrementCount;
  readonly decrementCount = this.store.decrementCount;
}
