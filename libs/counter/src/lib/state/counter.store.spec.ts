import { TestBed } from '@angular/core/testing';
import { CounterStore } from './counter.store';

describe('CounterStore', () => {
  let store: CounterStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [[CounterStore]],
    });

    store = TestBed.inject(CounterStore);
  });

  it('should start with count of 0', () => {
    expect(store.count()).toBe(0);
  });

  it('should increment count', () => {
    store.incrementCount();
    expect(store.count()).toBe(1);
    store.incrementCount();
    expect(store.count()).toBe(2);
  });

  it('should decrement count', () => {
    store.setCount(10);
    store.decrementCount();
    expect(store.count()).toBe(9);
  });

  it('should set count', () => {
    store.setCount(99);
    expect(store.count()).toBe(99);
  });

  it('inputCount should set count from a valid numeric string', () => {
    store.inputCount('42');
    expect(store.count()).toBe(42);
  });

  it('inputCount should ignore non-numeric input', () => {
    store.inputCount('abc');
    expect(store.count()).toBe(0);
  });
});
