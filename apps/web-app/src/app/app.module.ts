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
import { AppRoutingModule } from 'app/app-routing.module';
import { AppComponent } from 'app/core/containers/app/app.component';
import { CoreModule } from 'app/core/core.module';
import { entityConfig } from 'app/core/store/data/entity-metadata';
import { effects } from 'app/core/store/effects';
import { metaReducers, reducers } from 'app/core/store/reducers';
import { environment } from 'environments/environment';

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
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
