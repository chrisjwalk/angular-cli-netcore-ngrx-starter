import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { getState } from '@ngrx/signals';

import {
  AuthStore,
  AuthStoreInstance,
  authInitialState,
  authResponseInitialState,
} from './auth.store';

describe('AuthStore', () => {
  let store: AuthStoreInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting(), provideNoopAnimations()],
    });

    store = TestBed.inject(AuthStore);
  });

  it('should be created', () =>
    TestBed.runInInjectionContext(() => {
      expect(store).toBeDefined();
    }));

  it('should have the initial state', () =>
    TestBed.runInInjectionContext(() => {
      expect(getState(store)).toEqual({
        ...authInitialState,
        missingRefreshToken: true,
      });
    }));

  it('should set the loading state to true when login starts', () =>
    TestBed.runInInjectionContext(() => {
      store.loginStart();

      expect(store.loading()).toBe(true);
    }));

  it('should set the loading state to false and the logged in state to true when login succeeds', () =>
    TestBed.runInInjectionContext(() => {
      store.loginSuccess({ ...authResponseInitialState });

      expect(store.loading()).toBe(false);
      expect(store.loggedIn()).toBe(true);
    }));

  it('should set the loading state to false and the logged in state to false when login fails', () =>
    TestBed.runInInjectionContext(() => {
      const error = new Error('Login failed');
      store.loginError(error);

      expect(store.loading()).toBe(false);
      expect(store.loggedIn()).toBe(false);
    }));

  it('should set the logged in state to null when logout is called', () =>
    TestBed.runInInjectionContext(() => {
      store.logout(false);

      expect(store.loggedIn()).toBe(null);
    }));
});
