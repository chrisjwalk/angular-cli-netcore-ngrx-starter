import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { patchState } from '@ngrx/signals';

import { catchError, of, throwError } from 'rxjs';
import { AuthService, AuthServiceApi } from '../services/auth.service';
import { authInterceptor } from './auth.interceptor';
import * as authStore from './auth.store';
import {
  AuthStore,
  AuthStoreInstance,
  authResponseInitialState,
} from './auth.store';

describe('authInterceptor', () => {
  let store: AuthStoreInstance;
  let authService: AuthServiceApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
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
        loginStatus: 'success',
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
      });

      const next = jest.fn().mockReturnValue(of(null));

      authInterceptor(req, next).subscribe();

      expect(next).toHaveBeenCalledWith(req);
    }));

  it('should refresh the access token if the user is logged in and the access token is expired', () =>
    TestBed.runInInjectionContext(() => {
      let req = new HttpRequest('GET', '/api/v1/users');

      patchState(store, {
        response: {
          ...authResponseInitialState,
          accessToken: 'abc123',
          refreshToken: 'xyz789',
          accessTokenIssued: new Date(),
          expiresIn: 0,
        },
        loginStatus: 'success',
      });

      let nextCount = 0;

      const next = jest.fn().mockImplementation(() => {
        nextCount++;
        if (nextCount === 1) {
          return throwError(
            () =>
              new HttpErrorResponse({
                status: 400,
                statusText: 'Bad request',
              }),
          );
        }
        return of(null);
      });
      const refresh = jest.spyOn(store, 'refresh');

      jest
        .spyOn(authStore, 'getRefreshToken')
        .mockReturnValue(store.refreshToken());

      jest.spyOn(authService, 'refresh').mockReturnValue(
        of({
          ...authResponseInitialState,
          expiresIn: 3600,
          accessToken: 'cde345',
          refreshToken: null,
        }),
      );

      authInterceptor(req, next).subscribe();

      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer abc123',
        },
      });

      expect(next).toHaveBeenCalledWith(req);

      expect(refresh).toHaveBeenCalledWith({ refreshToken: 'xyz789' });

      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer cde345',
        },
      });

      expect(next).toHaveBeenLastCalledWith(req);
    }));

  it('should throw an error if the user is not logged in and the access token is expired', () =>
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/api/v1/users');

      patchState(store, {
        response: authResponseInitialState,
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

      authInterceptor(req, next)
        .pipe(
          catchError((error) => {
            expect(error).toEqual(new Error('Unauthorized'));
            throw error;
          }),
        )
        .subscribe();
    }));

  it('should throw an error the refresh token is not available', () =>
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
        loginStatus: 'success',
      });
      const unauthorizedResponnse = new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
      });

      const next = jest
        .fn()
        .mockReturnValue(throwError(() => unauthorizedResponnse));

      const logout = jest.spyOn(store, 'logout');

      jest.spyOn(authStore, 'getRefreshToken').mockReturnValue(null);

      authInterceptor(req, next)
        .pipe(
          catchError((error) => {
            expect(error).toEqual(unauthorizedResponnse);
            throw error;
          }),
        )
        .subscribe();

      expect(logout).toHaveBeenCalled();
    }));

  it('should throw an error the refresh token is expired', () =>
    TestBed.runInInjectionContext(() => {
      let req = new HttpRequest('GET', '/api/v1/users');

      patchState(store, {
        response: {
          ...authResponseInitialState,
          accessToken: 'abc123',
          refreshToken: 'xyz789',
          accessTokenIssued: new Date(),
          expiresIn: 0,
        },
        loginStatus: 'success',
      });
      const unauthorizedResponnse = new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
      });

      const next = jest
        .fn()
        .mockReturnValue(throwError(() => unauthorizedResponnse));

      const refresh = jest.spyOn(store, 'refresh');
      const logout = jest.spyOn(store, 'logout');

      jest
        .spyOn(authStore, 'getRefreshToken')
        .mockReturnValue(store.refreshToken());

      jest
        .spyOn(authService, 'refresh')
        .mockReturnValue(throwError(() => unauthorizedResponnse));

      authInterceptor(req, next)
        .pipe(
          catchError((error) => {
            expect(error).toEqual(unauthorizedResponnse);
            throw error;
          }),
        )
        .subscribe();

      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer abc123',
        },
      });

      expect(next).toHaveBeenCalledWith(req);

      expect(refresh).toHaveBeenCalledWith({ refreshToken: 'xyz789' });

      expect(logout).toHaveBeenCalled();
    }));

  it('should throw an error when a non 401 error is returned and the user is logged in', () =>
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/api/v1/users');

      patchState(store, {
        response: {
          ...authResponseInitialState,
          accessToken: 'abc123',
          refreshToken: 'xyz789',
          accessTokenIssued: new Date(),
          expiresIn: 3600,
        },
        loginStatus: 'success',
      });
      const badRequestResponnse = new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
      });

      const next = jest
        .fn()
        .mockReturnValue(throwError(() => badRequestResponnse));

      authInterceptor(req, next)
        .pipe(
          catchError((error) => {
            expect(error).toEqual(badRequestResponnse);
            throw error;
          }),
        )
        .subscribe();
    }));

  it('should throw an error when a non 401 error is returned and the user expired', () =>
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
        loginStatus: 'success',
      });
      const badRequestResponnse = new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
      });

      const next = jest
        .fn()
        .mockReturnValue(throwError(() => badRequestResponnse));

      authInterceptor(req, next)
        .pipe(
          catchError((error) => {
            expect(error).toEqual(badRequestResponnse);
            throw error;
          }),
        )
        .subscribe();
    }));
});
