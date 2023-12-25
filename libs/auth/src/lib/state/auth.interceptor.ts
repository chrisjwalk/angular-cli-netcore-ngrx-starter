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
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${store.accessToken()}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        const refreshToken = getRefreshToken();

        if (refreshToken) {
          store.refresh({ refreshToken });

          return loggedIn$.pipe(
            filter(
              (loggedIn) => loggedIn !== null && store.loggedIn() !== null,
            ),
            switchMap((loggedIn) => {
              if (!loggedIn) {
                throw error;
              }
              const newAccessToken = store.accessToken();
              req = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
              });
              return next(req);
            }),
            catchError((error) => {
              store.logout(true);
              throw error;
            }),
          );
        } else {
          store.logout(true);
          throw error;
        }
      } else {
        throw error;
      }
    }),
  );
}
