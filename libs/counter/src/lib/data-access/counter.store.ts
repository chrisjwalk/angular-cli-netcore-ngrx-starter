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
}

export const CounterStore = signalStore(withCounterFeature());
