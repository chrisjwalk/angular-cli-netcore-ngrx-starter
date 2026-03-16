import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { authInterceptor } from './auth.interceptor';
import { AuthStore, authResponseInitialState } from './auth.store';

@Component({
  selector: 'lib-mock-component',
  template: ``,
  standalone: true,
})
export class Mock {}

export const mockRoutes = [{ path: 'login', component: Mock }];

describe('authInterceptor', () => {
  let store: AuthStore;
  let authService: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting(), provideRouter(mockRoutes)],
    });

    store = TestBed.inject(AuthStore);
    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);

    // No auth_status cookie in the test environment — store skips the refresh
    // call and immediately transitions to 'no-refresh-token'.
    httpTestingController.verify();
  });

  it('should add an Authorization header to the request if the user is logged in', () =>
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/api/v1/users');

      store.setResponse(
        { ...authResponseInitialState, accessToken: 'abc123' },
        'success',
      );

      const next = vi.fn().mockReturnValue(of(null));
      authInterceptor(req, next).subscribe();

      expect(next).toHaveBeenCalledWith(
        req.clone({ setHeaders: { Authorization: 'Bearer abc123' } }),
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

  it('should refresh the access token when the server responds with 401', () =>
    TestBed.runInInjectionContext(() => {
      let req = new HttpRequest('GET', '/api/v1/users');

      store.setResponse(
        {
          ...authResponseInitialState,
          accessToken: 'abc123',
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
                status: 401,
                statusText: 'Unauthorized',
              }),
          );
        }
        return of(null);
      });

      const refresh = vi.spyOn(store, 'refresh');
      vi.spyOn(authService, 'refresh').mockReturnValue(
        of({
          ...authResponseInitialState,
          expiresIn: 3600,
          accessToken: 'cde345',
        }),
      );

      authInterceptor(req, next).subscribe();

      req = req.clone({ setHeaders: { Authorization: 'Bearer abc123' } });
      expect(next).toHaveBeenCalledWith(req);
      expect(refresh).toHaveBeenCalled();

      req = req.clone({ setHeaders: { Authorization: 'Bearer cde345' } });
      expect(next).toHaveBeenLastCalledWith(req);
    }));

  it('should throw an error if the user is not logged in and server returns 401', () =>
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/api/v1/users');
      store.setResponse(authResponseInitialState);

      const httpErrorResponse = new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
      });
      vi.spyOn(authService, 'refresh').mockReturnValue(
        throwError(() => httpErrorResponse),
      );

      const next = vi.fn().mockReturnValue(throwError(() => httpErrorResponse));

      authInterceptor(req, next).subscribe({
        error: (error) => expect(error).toEqual(httpErrorResponse),
      });
    }));

  it('should call logout and throw when the refresh attempt fails', () =>
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/api/v1/users');

      store.setResponse(
        {
          ...authResponseInitialState,
          accessToken: 'abc123',
          accessTokenIssued: new Date(),
          expiresIn: 0,
        },
        'success',
      );

      const unauthorizedResponse = new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
      });

      const next = vi
        .fn()
        .mockReturnValue(throwError(() => unauthorizedResponse));
      const logout = vi.spyOn(store, 'logout');
      vi.spyOn(authService, 'refresh').mockReturnValue(
        throwError(() => unauthorizedResponse),
      );

      authInterceptor(req, next).subscribe({
        error: (error) => expect(error).toEqual(unauthorizedResponse),
      });

      expect(logout).toHaveBeenCalled();
    }));

  it('should throw an error when a non-401 error is returned and the user is logged in', () =>
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/api/v1/users');

      store.setResponse(
        {
          ...authResponseInitialState,
          accessToken: 'abc123',
          accessTokenIssued: new Date(),
          expiresIn: 3600,
        },
        'success',
      );
      const badRequestResponse = new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
      });

      const next = vi
        .fn()
        .mockReturnValue(throwError(() => badRequestResponse));

      authInterceptor(req, next).subscribe({
        error: (error) => expect(error).toEqual(badRequestResponse),
      });
    }));

  it('should throw an error when a non-401 error is returned and the token is expired', () =>
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/api/v1/users');

      store.setResponse(
        {
          ...authResponseInitialState,
          accessToken: 'abc123',
          accessTokenIssued: new Date(),
          expiresIn: 0,
        },
        'success',
      );
      const badRequestResponse = new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
      });

      const next = vi
        .fn()
        .mockReturnValue(throwError(() => badRequestResponse));

      authInterceptor(req, next).subscribe({
        error: (error) => expect(error).toEqual(badRequestResponse),
      });
    }));

  it('should retry request after refresh if user is logged in', () =>
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/api/v1/users');
      store.setResponse(
        {
          ...authResponseInitialState,
          accessToken: 'abc123',
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
                status: 401,
                statusText: 'Unauthorized',
              }),
          );
        }
        return of('success');
      });

      vi.spyOn(store, 'refresh').mockImplementation(() => {
        store.loginSuccessful({
          ...authResponseInitialState,
          accessToken: 'newtoken',
        });
      });

      authInterceptor(req, next).subscribe((result) => {
        expect(result).toBe('success');
        expect(next).toHaveBeenCalledTimes(2);
      });
    }));

  it('should not trigger refresh for non-401 errors even when the token is expired', () =>
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/api/v1/users');

      store.setResponse(
        {
          ...authResponseInitialState,
          accessToken: 'abc123',
          accessTokenIssued: new Date(),
          expiresIn: 0,
        },
        'success',
      );
      const badRequestResponse = new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
      });
      const next = vi
        .fn()
        .mockReturnValue(throwError(() => badRequestResponse));
      const refresh = vi.spyOn(store, 'refresh');

      authInterceptor(req, next).subscribe({
        error: (error) => expect(error).toEqual(badRequestResponse),
      });

      expect(refresh).not.toHaveBeenCalled();
    }));

  it('should not start a duplicate refresh when one is already in progress', () =>
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/api/v1/users');

      store.setResponse(
        {
          ...authResponseInitialState,
          accessToken: 'abc123',
          accessTokenIssued: new Date(),
          expiresIn: 3600,
        },
        'success',
      );

      // Simulate a refresh already in flight
      store.loginStart();

      const next = vi.fn().mockReturnValue(
        throwError(
          () =>
            new HttpErrorResponse({
              status: 401,
              statusText: 'Unauthorized',
            }),
        ),
      );
      const refresh = vi.spyOn(store, 'refresh');

      authInterceptor(req, next).subscribe();

      expect(refresh).not.toHaveBeenCalled();
    }));
});
