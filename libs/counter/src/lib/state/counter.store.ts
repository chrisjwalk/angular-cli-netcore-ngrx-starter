import {
  patchState,
  signalMethod,
  signalStore,
  withMethods,
  withState,
} from '@ngrx/signals';
// NOTE: @ngrx/signals/events is deliberately NOT used here because its internal
// dependency on takeUntilDestroyed (from @angular/core/rxjs-interop) would get
// inlined with a private _injectImplementation by the federation plugin,
// causing NG0203 when the store is created in an MFE remote.

export type CounterState = {
  count: number;
};

export const counterInitialState: CounterState = { count: 0 };

export const CounterStore = signalStore(
  { providedIn: 'root' },
  withState(counterInitialState),
  withMethods((store) => ({
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
    setCount: (count: number) => patchState(store, { count }),
    inputCount: signalMethod<number | string>((count) => {
      if (!isNaN(+count)) {
        patchState(store, { count: +count });
      }
    }),
  })),
);

export type CounterStore = InstanceType<typeof CounterStore>;
