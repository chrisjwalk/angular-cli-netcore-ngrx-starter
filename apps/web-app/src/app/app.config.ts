import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { EntityDataModule } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../environments/environment';
import { routes } from './app-routes';
import { entityConfig } from './core/store/data/entity-metadata';
import { effects } from './core/store/effects';
import { metaReducers, reducers } from './core/store/reducers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    importProvidersFrom(
      BrowserAnimationsModule,
      MatSnackBar,
      StoreModule.forRoot(reducers, {
        metaReducers,
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
          strictStateSerializability: true,
          strictActionSerializability: true,
        },
      }),
      StoreRouterConnectingModule.forRoot({ routerState: RouterState.Minimal }),
      EffectsModule.forRoot(effects),
      EntityDataModule.forRoot(entityConfig),
      !environment.production ? StoreDevtoolsModule.instrument() : [],
      ServiceWorkerModule.register('/ngsw-worker.js', {
        enabled: environment.production,
      }),
    ),
  ],
};
