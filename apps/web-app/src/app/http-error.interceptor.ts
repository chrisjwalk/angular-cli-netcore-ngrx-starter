import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NotificationStore } from '@myorg/shared';
import { catchError, throwError } from 'rxjs';

/**
 * Routes unexpected request failures into the notification center.
 *
 * Layering (see docs/recipes/error-handling.md):
 * - Notify only for status 0 (network/offline) and 5xx (server faults).
 *   Domain errors keep their local inline UI: 400 feeds form validation,
 *   401 belongs to the auth interceptor's refresh flow, 403/404 surface via
 *   per-feature resource.error() banners, 429 is the rate-limit policy.
 * - Always rethrow so downstream handlers (authInterceptor's 401 refresh,
 *   per-feature tapResponse / resource.error()) still run.
 * - Registered LAST in withInterceptors, making this the outermost
 *   interceptor: it sees every error and never swallows one.
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  // Functional interceptors run in the environment injector, so this resolves
  // the same root-provided NotificationStore the notification bell uses.
  const notifications = inject(NotificationStore);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && shouldNotify(error.status)) {
        notifications.add({
          kind: 'error',
          title: error.status === 0 ? 'Network error' : 'Server error',
          detail: describe(error),
          autoDismissMs: 8000,
        });
      }
      return throwError(() => error);
    }),
  );
};

function shouldNotify(status: number): boolean {
  return status === 0 || status >= 500;
}

function describe(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'Check your connection and try again.';
  }
  return `${error.status} ${error.statusText}${
    error.url ? ` — ${error.url}` : ''
  }`;
}
