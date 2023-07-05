import { Injectable, computed, signal } from '@angular/core';

export interface CounterState {
  count: number;
  loading: boolean;
  error: any;
}

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  private state = signal<CounterState>({
    count: 0,
    loading: null,
    error: null,
  });

  count = computed(() => this.state().count);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  setCount(count: number) {
    this.state.update((state) => ({ ...state, count }));
  }

  incrementCount() {
    this.state.update((state) => ({ ...state, count: state.count + 1 }));
  }

  decrementCount() {
    this.state.update((state) => ({ ...state, count: state.count - 1 }));
  }
}
