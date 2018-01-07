import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { MaterialModule } from 'app/shared/material';
import { SharedModule } from 'app/shared';

import { AppService, HttpInterceptorService } from 'app/core/services';

import { AppComponent } from 'app/core/containers/app/app.component';
import { HomeComponent } from 'app/core/containers/home/home.component';

import { MainToolbarComponent } from 'app/core/components/main-toolbar/main-toolbar.component';
import { SidenavComponent } from 'app/core/components/sidenav/sidenav.component';
import { SidenavListItemComponent } from 'app/core/components/sidenav-list-item/sidenav-list-item.component';

export const COMPONENTS = [
  AppComponent,
  HomeComponent,
  MainToolbarComponent,
  SidenavComponent,
  SidenavListItemComponent
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    SharedModule
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [
    AppService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ]
})
export class CoreModule { }
