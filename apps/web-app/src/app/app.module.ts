import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { EntityDataModule } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './core/containers/app/app.component';
import { CoreModule } from './core/core.module';
import { entityConfig } from './core/store/data/entity-metadata';
import { effects } from './core/store/effects';
import { metaReducers, reducers } from './core/store/reducers';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
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
    CoreModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
