import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CounterFacade {
  #count = signal(0);
  count = computed(this.#count);

  setCount(count: number) {
    this.#count.set(count);
  }

  incrementCount() {
    this.#count.update((value) => value + 1);
  }

  decrementCount() {
    this.#count.update((value) => value - 1);
  }
}
