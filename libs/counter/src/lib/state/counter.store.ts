import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap } from 'rxjs';

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
    inputCount: rxMethod<number>(
      pipe(
        tap((count) => {
          if (!isNaN(+count)) {
            store.setCount(+count);
          }
        }),
      ),
    ),
  })),
);

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
