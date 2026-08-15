import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
  withPreloading,
} from '@angular/router';
import { provideContent, withMarkdownRenderer } from '@analogjs/content';
import { authInterceptor } from '@myorg/auth';
import { NotificationStore, SwUpdateStore } from '@myorg/shared';

import { apiBaseUrlInterceptor } from './api-base-url.interceptor';
import { routes } from './app.routes';
import { AppErrorHandler } from './error-handler';
import { httpErrorInterceptor } from './http-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        apiBaseUrlInterceptor,
        authInterceptor,
        // Last = outermost: sees every error, never swallows one.
        httpErrorInterceptor,
      ]),
    ),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling({ anchorScrolling: 'enabled' }),
      withPreloading(PreloadAllModules),
    ),
    provideContent(
      withMarkdownRenderer({
        loadMermaid: !import.meta.env.SSR ? () => import('mermaid') : undefined,
      }),
    ),
    // Root-provided so the notification bell (in App) and the global error
    // handlers (interceptor + ErrorHandler) share a single instance.
    NotificationStore,
    SwUpdateStore,
    { provide: ErrorHandler, useClass: AppErrorHandler },
  ],
};
