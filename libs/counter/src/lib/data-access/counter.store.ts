import { Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';

export type CounterState = {
  count: number;
  loading: boolean;
  error: any;
};

@Injectable()
export class CounterStore
  extends ComponentStore<CounterState>
  implements OnStoreInit
{
  ngrxOnStoreInit() {
    this.setState({
      count: 0,
      loading: null,
      error: null,
    });
  }

  readonly count = this.selectSignal((state) => state.count);
  readonly loading = this.selectSignal((state) => state.loading);
  readonly error = this.selectSignal((state) => state.error);

  readonly setCount = (count: number) => this.patchState({ count });

  readonly incrementCount = this.updater((state) => ({
    ...state,
    count: state.count + 1,
  }));

  readonly decrementCount = this.updater((state) => ({
    ...state,
    count: state.count - 1,
  }));
}
