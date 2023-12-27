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

  it('should have the no refresh token state when no refresh token is unavailble', () =>
    TestBed.runInInjectionContext(() => {
      expect(getState(store)).toEqual({
        ...authInitialState,
        loginStatus: 'no-refresh-token',
      });
    }));

  it('should set the loading state to true when login starts', () =>
    TestBed.runInInjectionContext(() => {
      store.loginStart();

      expect(store.loading()).toBe(true);
    }));

  it('should set the loading state to false and the logged in state to true when login succeeds', () =>
    TestBed.runInInjectionContext(() => {
      store.loginSuccessful({
        ...authResponseInitialState,
        accessToken: 'token',
      });

      expect(store.loading()).toBe(false);
      expect(store.loggedIn()).toBe(true);
    }));

  it('should set the loading state to false and the logged in state to false when login fails', () =>
    TestBed.runInInjectionContext(() => {
      const error = new Error('Login failed');
      store.loginFailure(error);

      expect(store.loading()).toBe(false);
      expect(store.loggedIn()).toBe(false);
      expect(store.loginError()).toBe(true);
    }));

  it('should set the logged in state to logged out when logout is called', () =>
    TestBed.runInInjectionContext(() => {
      store.logout(false);
      expect(store.loginStatus()).toBe('logged-out');
      expect(store.loggedOut()).toBe(true);
      expect(store.loggedIn()).toBe(false);
    }));
});
