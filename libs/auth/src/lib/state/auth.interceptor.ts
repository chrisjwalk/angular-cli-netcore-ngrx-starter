import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, catchError, filter, switchMap } from 'rxjs';

import { AuthStore, getRefreshToken } from './auth.store';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const store = inject(AuthStore);
  const loggedIn$ = toObservable(store.loggedIn);

  if (store.loggedIn()) {
    req = setAuthorizationHeader(req, store.accessToken());
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 || store.expired()) {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          store.logout(true);
          throw error;
        }

        store.refresh({ refreshToken });

        return loggedIn$.pipe(
          filter(() => store.loggedIn() !== null),
          switchMap(() => {
            if (!store.loggedIn()) {
              throw error;
            }

            return next(setAuthorizationHeader(req, store.accessToken()));
          }),
          catchError((error) => {
            store.logout(true);
            throw error;
          }),
        );
      }

      throw error;
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
