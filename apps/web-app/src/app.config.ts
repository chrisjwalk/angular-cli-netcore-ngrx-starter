import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  Routes,
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';

import { environment } from './environments/environment';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('@myorg/home').then((m) => m.homeRoutes),
  },
  {
    path: 'feature',
    loadChildren: () => import('@myorg/counter').then((m) => m.counterRoutes),
  },
  {
    path: 'weather-forecast',
    loadChildren: () =>
      import('@myorg/weather-forecast').then((m) => m.weatherForecastRoutes),
  },
  { path: '**', redirectTo: '' },
];

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
