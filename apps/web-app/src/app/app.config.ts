import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
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

import { apiBaseUrlInterceptor } from './api-base-url.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(
      withFetch(),
      withInterceptors([apiBaseUrlInterceptor, authInterceptor]),
    ),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling({ anchorScrolling: 'enabled' }),
      withPreloading(PreloadAllModules),
    ),
    provideAnimations(),
    provideContent(
      withMarkdownRenderer({
        loadMermaid: !import.meta.env.SSR ? () => import('mermaid') : undefined,
      }),
    ),
  ],
};
