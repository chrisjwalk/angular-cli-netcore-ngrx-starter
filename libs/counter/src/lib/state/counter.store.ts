import {
  patchState,
  signalStore,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';

export type CounterState = {
  count: number;
  loading: boolean;
  error: unknown;
};

export function withCounterFeature() {
  return signalStoreFeature(
    withState<CounterState>({ count: 0, loading: null, error: null }),
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
  );
}

export const CounterStore = signalStore(withCounterFeature());
