import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { patchState } from '@ngrx/signals';

import { of, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { authInterceptor } from './auth.interceptor';
import * as authStore from './auth.store';
import {
  AuthStore,
  AuthStoreInstance,
  authResponseInitialState,
} from './auth.store';

describe('authInterceptor', () => {
  let store: AuthStoreInstance;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthStore],
    });

    store = TestBed.inject(AuthStore);
    authService = TestBed.inject(AuthService);
  });
  it('should add an Authorization header to the request if the user is logged in', () =>
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/api/v1/users');

      patchState(store, {
        response: {
          ...authResponseInitialState,
          accessToken: 'abc123',
          refreshToken: 'xyz789',
        },
        loggedIn: true,
      });

      const next = jest.fn().mockReturnValue(of(null));

      authInterceptor(req, next).subscribe();

      expect(next).toHaveBeenCalledWith(
        req.clone({
          setHeaders: {
            Authorization: 'Bearer abc123',
          },
        }),
      );
    }));

  it('should not add an Authorization header to the request if the user is not logged in', () =>
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/api/v1/users');

      patchState(store, {
        response: authResponseInitialState,
        loggedIn: false,
      });

      const next = jest.fn().mockReturnValue(of(null));

      authInterceptor(req, next).subscribe();

      expect(next).toHaveBeenCalledWith(req);
    }));

  it('should refresh the access token if the user is logged in and the access token is expired', () =>
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/api/v1/users');

      patchState(store, {
        response: {
          ...authResponseInitialState,
          accessToken: 'abc123',
          refreshToken: 'xyz789',
          accessTokenIssued: new Date(),
          expiresIn: 0,
        },
        loggedIn: true,
      });

      const next = jest.fn().mockReturnValue(
        throwError(
          () =>
            new HttpErrorResponse({
              status: 401,
              statusText: 'Unauthorized',
            }),
        ),
      );
      const refresh = jest.spyOn(store, 'refresh');
      jest
        .spyOn(authStore, 'getRefreshToken')
        .mockReturnValue(store.refreshToken());

      jest.spyOn(authService, 'refresh').mockReturnValue(
        of({
          ...authResponseInitialState,
          expiresIn: 3600,
          accessToken: 'abc123',
          refreshToken: null,
        }),
      );

      authInterceptor(req, next).subscribe();

      expect(refresh).toHaveBeenCalledWith({ refreshToken: 'xyz789' });

      patchState(store, {
        response: {
          ...authResponseInitialState,
          accessToken: 'abc123',
          refreshToken: null,
        },
        loggedIn: true,
      });

      expect(next).toHaveBeenCalledWith(
        req.clone({
          setHeaders: {
            Authorization: 'Bearer abc123',
          },
        }),
      );
    }));

  it('should throw an error if the user is not logged in and the access token is expired', () =>
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/api/v1/users');

      patchState(store, {
        response: authResponseInitialState,
        loggedIn: false,
      });

      const next = jest.fn().mockReturnValue(of(null));

      authInterceptor(req, next).subscribe(
        () => {},
        (error) => {
          expect(error).toEqual(new Error('Unauthorized'));
        },
      );
    }));
});
