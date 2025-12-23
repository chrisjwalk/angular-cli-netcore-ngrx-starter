import {
  patchState,
  signalMethod,
  signalStore,
  signalStoreFeature,
  type,
  withMethods,
  withState,
} from '@ngrx/signals';
import { eventGroup, on, withReducer } from '@ngrx/signals/events';

export type CounterState = {
  count: number;
};

export const counterEvents = eventGroup({
  source: 'Counter Page',
  events: {
    setCount: type<number>(),
    incrementCount: type<void>(),
    decrementCount: type<void>(),
  },
});

export const counterInitialState: CounterState = { count: 0 };

export function incrementCount() {
  return (state: CounterState) => ({
    ...state,
    count: state.count + 1,
  });
}

export function decrementCount() {
  return (state: CounterState) => ({
    ...state,
    count: state.count - 1,
  });
}

export function setCount(count: number) {
  return { count };
}

export function withCounterFeature() {
  return signalStoreFeature(
    withState(counterInitialState),
    withMethods((store) => ({
      inputCount: signalMethod<number | string>((count) => {
        if (!isNaN(+count)) {
          patchState(store, setCount(+count));
        }
      }),
    })),
  );
}

export function withCounterReducer() {
  return signalStoreFeature(
    { state: type<CounterState>() },
    withReducer(
      on(counterEvents.setCount, ({ payload }) => setCount(payload)),
      on(counterEvents.incrementCount, () => incrementCount()),
      on(counterEvents.decrementCount, () => decrementCount()),
    ),
  );
}

export const CounterStore = signalStore(
  withCounterFeature(),
  withCounterReducer(),
);

export type CounterStore = InstanceType<typeof CounterStore>;
