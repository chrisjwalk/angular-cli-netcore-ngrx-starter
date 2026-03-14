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
      if (error?.status === 401 || store.expired()) {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          store.logout(true);
          return throwError(() => error);
        }

        store.refresh({ refreshToken });

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
