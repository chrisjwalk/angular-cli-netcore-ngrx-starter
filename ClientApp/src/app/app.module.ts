import { NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { ServerTransferStateModule } from '@angular/platform-server';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  StoreRouterConnectingModule,
  RouterStateSerializer,
} from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from 'environments/environment';

import { reducers, metaReducers } from 'app/core/store/reducers';
import { effects } from 'app/core/store/effects';

import { CoreModule } from 'app/core/core.module';
import { AppRoutingModule } from 'app/app-routing.module';

import { AppComponent } from 'app/core/containers/app/app.component';


@NgModule({
  imports: [
    BrowserModule.withServerTransition({appId: 'angular-cli-ngrx-starter'}),
    BrowserAnimationsModule,
    ServerTransferStateModule,
    BrowserTransferStateModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreRouterConnectingModule,
    EffectsModule.forRoot(effects),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
