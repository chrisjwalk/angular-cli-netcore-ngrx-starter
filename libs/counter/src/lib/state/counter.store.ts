import {
  patchState,
  signalStore,
  signalStoreFeature,
  type,
  withMethods,
  withState,
} from '@ngrx/signals';
import { eventGroup, on, withReducer } from '@ngrx/signals/events';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, map, pipe, tap } from 'rxjs';

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
      inputCount: rxMethod<number | string>(
        pipe(
          map((count) => +count),
          filter((count) => !isNaN(count)),
          tap((count) => patchState(store, setCount(+count))),
        ),
      ),
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
