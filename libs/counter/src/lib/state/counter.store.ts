import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
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

export const conuterInitialState: CounterState = { count: 0 };

export function withCounterFeature() {
  return signalStoreFeature(
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
  );
}

export const CounterStore = signalStore(withCounterFeature());

export function getCounterFormGroup(
  formBuilder: FormBuilder,
  store: CounterStoreInstance,
) {
  const formGroup = formBuilder.group({
    count: [store.count()],
  });

  formGroup.valueChanges
    .pipe(takeUntilDestroyed())
    .subscribe((value) => patchState(store, value));

  return formGroup;
}

export type CounterStoreInstance = InstanceType<typeof CounterStore>;
export type CounterFormGroup = ReturnType<typeof getCounterFormGroup>;
