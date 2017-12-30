import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MaterialModule } from 'app/shared/material';
import { SharedModule } from 'app/shared';

import { AppComponent } from 'app/core/containers/app/app.component';
import { HomeComponent } from 'app/core/containers/home/home.component';

export const COMPONENTS = [
  AppComponent,
  HomeComponent
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    SharedModule
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class CoreModule { }
