import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FeatureFacade {
  count = signal(0);

  setCount(count: number) {
    this.count.set(count);
  }

  incrementCount() {
    this.count.update((value) => value + 1);
  }

  decrementCount() {
    this.count.update((value) => value - 1);
  }
}
