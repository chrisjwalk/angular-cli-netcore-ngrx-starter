import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { EntityDataModule } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { routes } from './app/app-routes';
import { AppComponent } from './app/core/containers/app/app.component';
import { entityConfig } from './app/core/store/data/entity-metadata';
import { effects } from './app/core/store/effects';
import { metaReducers, reducers } from './app/core/store/reducers';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
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
}).catch((err) => console.error(err));
