import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';

import { environment } from '../environments/environment';
import { routes } from './app-routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    importProvidersFrom(
      BrowserAnimationsModule,
      MatSnackBar,
      ServiceWorkerModule.register('/ngsw-worker.js', {
        enabled: environment.production,
      }),
    ),
  ],
};
