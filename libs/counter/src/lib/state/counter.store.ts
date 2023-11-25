import {
  patchState,
  signalStore,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';

export type CounterState = {
  count: number;
};

export const conuterInitialState = { count: 0 };

export function withCounterFeature() {
  return signalStoreFeature(
    withState<CounterState>(conuterInitialState),
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
