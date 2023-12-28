import { TestBed } from '@angular/core/testing';
import {
  CounterStore,
  CounterStoreInstance,
  conuterInitialState,
  getCounterFormGroup,
} from './counter.store';
import { inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';

describe('CounterStore', () => {
  let store: CounterStoreInstance;

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

  it('should get the counter form group', () =>
    TestBed.runInInjectionContext(() => {
      const formGroup = getCounterFormGroup(inject(FormBuilder), store);
      expect(formGroup).toBeDefined();
      expect(formGroup.controls.count).toBeDefined();
      expect(formGroup.controls.count.value).toBe(conuterInitialState.count);

      formGroup.controls.count.setValue(100);
      expect(store.count()).toBe(100);

      formGroup.patchValue({ count: 200 });
      expect(store.count()).toBe(200);
    }));
});
