import { Injectable, computed } from '@angular/core';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';

export interface CounterState {
  count: number;
  loading: boolean;
  error: any;
}

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

  count = computed(() => this.state().count);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  readonly setCount = this.updater((state, count: number) => ({
    ...state,
    count,
  }));

  readonly incrementCount = this.updater((state) => ({
    ...state,
    count: state.count + 1,
  }));

  readonly decrementCount = this.updater((state) => ({
    ...state,
    count: state.count - 1,
  }));
}
