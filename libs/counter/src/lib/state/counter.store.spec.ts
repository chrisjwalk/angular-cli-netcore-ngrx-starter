import { TestBed } from '@angular/core/testing';
import { CounterStore, conuterInitialState } from './counter.store';

describe('CounterStore', () => {
  let store: InstanceType<typeof CounterStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [[CounterStore]],
    });

    store = TestBed.inject(CounterStore);
  });

  it('should keep track of count', () => {
    let count = conuterInitialState.count;
    expect(store).toBeTruthy();
    expect(store.count()).toBe(count);
    store.incrementCount();
    count++;
    expect(store.count()).toBe(count);
    store.incrementCount();
    count++;
    expect(store.count()).toBe(count);
    count = 99;
    store.setCount(count);
    expect(store.count()).toBe(count);
    store.decrementCount();
    count--;
    expect(store.count()).toBe(count);
  });
});
