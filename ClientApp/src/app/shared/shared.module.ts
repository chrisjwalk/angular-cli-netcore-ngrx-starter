import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/shared/material';
import { BigButtonComponent } from './big-button/big-button.component';
import { PageToolbarComponent } from './page-toolbar/page-toolbar.component';

const COMPONENTS = [BigButtonComponent, PageToolbarComponent];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class SharedModule { }
