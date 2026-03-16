import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, filter, switchMap, throwError } from 'rxjs';

import { AuthStore, getRefreshToken } from './auth.store';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const store = inject(AuthStore);

  if (store.loggedIn()) {
    req = setAuthorizationHeader(req, store.accessToken());
  }

  return next(req).pipe(
    catchError((error) => {
      if (error?.status === 401) {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          store.logout(true);
          return throwError(() => error);
        }

        // Guard against concurrent 401s: only start a new refresh when one
        // isn't already in flight. Any other failing request will subscribe to
        // loginStatus$ and wait for the same refresh to complete.
        if (!store.loginLoading()) {
          store.refresh({ refreshToken });
        }

        return store.loginStatus$.pipe(
          filter(() => store.loginAttempted()),
          switchMap(() => {
            if (!store.loggedIn()) {
              store.logout(true);
              return throwError(() => error);
            }

            return next(setAuthorizationHeader(req, store.accessToken()));
          }),
        );
      }

      return throwError(() => error);
    }),
  );
}

function setAuthorizationHeader(
  req: HttpRequest<unknown>,
  accessToken: string,
) {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
