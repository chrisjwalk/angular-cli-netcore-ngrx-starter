import { TestBed } from '@angular/core/testing';
import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import {
  counterInitialState,
  CounterStore,
  decrementCount,
  incrementCount,
  setCount,
} from './counter.store';

describe('CounterStore', () => {
  let store: CounterStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [[CounterStore]],
    });

    store = TestBed.inject(CounterStore);
  });

  it('should keep track of count', () => {
    let count = counterInitialState.count;
    expect(store).toBeTruthy();
    expect(store.count()).toBe(count);
    patchState(unprotected(store), incrementCount());
    count++;
    expect(store.count()).toBe(count);
    patchState(unprotected(store), incrementCount());
    count++;
    expect(store.count()).toBe(count);
    count = 99;
    patchState(unprotected(store), setCount(count));
    expect(store.count()).toBe(count);
    patchState(unprotected(store), decrementCount());
    count--;
    expect(store.count()).toBe(count);
  });
});
