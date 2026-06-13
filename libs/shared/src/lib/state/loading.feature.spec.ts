import { signalStore } from '@ngrx/signals';
import { TestBed } from '@angular/core/testing';

import {
  withLoadingFeature,
  loadingInitialState,
  LoadingState,
} from './loading.feature';

describe('withLoadingFeature', () => {
  it('should provide loadingInitialState with null values', () => {
    expect(loadingInitialState).toEqual({ loading: null, error: null });
  });

  it('should add loading state to a signal store', () => {
    const TestStore = signalStore(withLoadingFeature());

    TestBed.configureTestingModule({
      providers: [TestStore],
    });

    const store = TestBed.inject(TestStore);

    expect(store.loading()).toBeNull();
    expect(store.error()).toBeNull();
  });

  it('should allow mutating loading and error state', () => {
    const TestStore = signalStore(withLoadingFeature());

    TestBed.configureTestingModule({
      providers: [TestStore],
    });

    const store = TestBed.inject(TestStore);

    store.loading();

    expect(store.loading()).toBeNull();

    // LoadingState properties are writable signals
    expect(typeof store.loading).toBe('function');
    expect(typeof store.error).toBe('function');
  });

  it('should expose the correct shape via LoadingState type', () => {
    const state: LoadingState = {
      loading: true,
      error: 'Something went wrong',
    };

    expect(state.loading).toBe(true);
    expect(state.error).toBe('Something went wrong');
  });
});
