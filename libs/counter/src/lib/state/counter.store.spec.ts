import { TestBed } from '@angular/core/testing';
import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { injectDispatch } from '@ngrx/signals/events';
import {
  counterInitialState,
  CounterStore,
  counterEvents,
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

  it('inputCount should set count from a valid numeric string', () => {
    store.inputCount('42');
    expect(store.count()).toBe(42);
  });

  it('inputCount should ignore non-numeric input', () => {
    store.inputCount('abc');
    expect(store.count()).toBe(0);
  });

  it('should handle setCount event via reducer', () => {
    const dispatcher = TestBed.runInInjectionContext(() =>
      injectDispatch(counterEvents),
    );
    dispatcher.setCount(7);
    TestBed.flushEffects();
    expect(store.count()).toBe(7);
  });

  it('should handle incrementCount event via reducer', () => {
    const dispatcher = TestBed.runInInjectionContext(() =>
      injectDispatch(counterEvents),
    );
    dispatcher.incrementCount();
    TestBed.flushEffects();
    expect(store.count()).toBe(1);
  });

  it('should handle decrementCount event via reducer', () => {
    const dispatcher = TestBed.runInInjectionContext(() =>
      injectDispatch(counterEvents),
    );
    patchState(unprotected(store), setCount(5));
    dispatcher.decrementCount();
    TestBed.flushEffects();
    expect(store.count()).toBe(4);
  });
});
