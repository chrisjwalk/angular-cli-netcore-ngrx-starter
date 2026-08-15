import { HttpErrorResponse } from '@angular/common/http';
import {
  EnvironmentInjector,
  ErrorHandler,
  Injectable,
  inject,
  runInInjectionContext,
} from '@angular/core';
import { NotificationStore } from '@myorg/shared';

/**
 * Global ErrorHandler that reports unhandled errors to the notification center.
 *
 * - HttpErrorResponse is skipped: the httpErrorInterceptor already notified.
 * - handleError() runs outside any injection context, so the store is
 *   injected inside runInInjectionContext with the captured EnvironmentInjector.
 */
@Injectable()
export class AppErrorHandler implements ErrorHandler {
  private readonly injector = inject(EnvironmentInjector);

  handleError(error: unknown): void {
    console.error('Unhandled error:', error);

    if (error instanceof HttpErrorResponse) {
      return;
    }

    runInInjectionContext(this.injector, () => {
      inject(NotificationStore).add({
        kind: 'error',
        title: 'Unexpected error',
        detail: messageOf(error),
        autoDismissMs: 8000,
      });
    });
  }
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
