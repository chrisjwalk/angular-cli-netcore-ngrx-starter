import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthStore } from './auth.store';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const store = inject(AuthStore);

  if (store.loggedIn()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${store.accessToken()}`,
      },
    });
  }
  return next(req);
}
