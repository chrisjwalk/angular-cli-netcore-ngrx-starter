import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { catchError, of, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { authInterceptor } from './auth.interceptor';
import * as authStore from './auth.store';
import { AuthStore, authResponseInitialState } from './auth.store';

@Component({
  selector: 'lib-mock-component',
  template: ``,
  standalone: true,
})
export class MockComponent {}

export const mockRoutes = [
  {
    path: 'login',
    component: MockComponent,
  },
];

describe('authInterceptor', () => {
  let store: AuthStore;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting(), provideRouter(mockRoutes)],
    });

    store = TestBed.inject(AuthStore);
    authService = TestBed.inject(AuthService);
  });
  it('should add an Authorization header to the request if the user is logged in', () =>
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/api/v1/users');

      store.setResponse(
        {
          ...authResponseInitialState,
          accessToken: 'abc123',
          refreshToken: 'xyz789',
        },
        'success',
      );

      const next = vi.fn().mockReturnValue(of(null));

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

      store.setResponse(authResponseInitialState);

      const next = vi.fn().mockReturnValue(of(null));

      authInterceptor(req, next).subscribe();

      expect(next).toHaveBeenCalledWith(req);
    }));

  it('should refresh the access token if the user is logged in and the access token is expired', () =>
    TestBed.runInInjectionContext(() => {
      let req = new HttpRequest('GET', '/api/v1/users');

      store.setResponse(
        {
          ...authResponseInitialState,
          accessToken: 'abc123',
          refreshToken: 'xyz789',
          accessTokenIssued: new Date(),
          expiresIn: 0,
        },
        'success',
      );

      let nextCount = 0;

      const next = vi.fn().mockImplementation(() => {
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
      const refresh = vi.spyOn(store, 'refresh');

      vi.spyOn(authStore, 'getRefreshToken').mockReturnValue(
        store.refreshToken(),
      );

      vi.spyOn(authService, 'refresh').mockReturnValue(
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

      store.setResponse(authResponseInitialState);
      const httpErrorResponse = new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
      });

      const next = vi.fn().mockReturnValue(throwError(() => httpErrorResponse));

      authInterceptor(req, next)
        .pipe(
          catchError((error) => {
            expect(error).toEqual(httpErrorResponse);
            throw error;
          }),
        )
        .subscribe();
    }));

  it('should throw an error the refresh token is not available', () =>
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/api/v1/users');

      store.setResponse(
        {
          ...authResponseInitialState,
          accessToken: 'abc123',
          refreshToken: 'xyz789',
          accessTokenIssued: new Date(),
          expiresIn: 0,
        },
        'success',
      );
      const unauthorizedResponnse = new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
      });

      const next = vi
        .fn()
        .mockReturnValue(throwError(() => unauthorizedResponnse));

      const logout = vi.spyOn(store, 'logout');

      vi.spyOn(authStore, 'getRefreshToken').mockReturnValue(null);

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

      store.setResponse(
        {
          ...authResponseInitialState,
          accessToken: 'abc123',
          refreshToken: 'xyz789',
          accessTokenIssued: new Date(),
          expiresIn: 0,
        },
        'success',
      );
      const unauthorizedResponnse = new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
      });

      const next = vi
        .fn()
        .mockReturnValue(throwError(() => unauthorizedResponnse));

      const refresh = vi.spyOn(store, 'refresh');
      const logout = vi.spyOn(store, 'logout');

      vi.spyOn(authStore, 'getRefreshToken').mockReturnValue(
        store.refreshToken(),
      );

      vi.spyOn(authService, 'refresh').mockReturnValue(
        throwError(() => unauthorizedResponnse),
      );

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

      store.setResponse(
        {
          ...authResponseInitialState,
          accessToken: 'abc123',
          refreshToken: 'xyz789',
          accessTokenIssued: new Date(),
          expiresIn: 3600,
        },
        'success',
      );
      const badRequestResponnse = new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
      });

      const next = vi
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

      store.setResponse(
        {
          ...authResponseInitialState,
          accessToken: 'abc123',
          refreshToken: 'xyz789',
          accessTokenIssued: new Date(),
          expiresIn: 0,
        },
        'success',
      );
      const badRequestResponnse = new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
      });

      const next = vi
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
