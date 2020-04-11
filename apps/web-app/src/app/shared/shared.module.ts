import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/shared/material';
import { BigButtonComponent } from './big-button/big-button.component';
import { PageToolbarComponent } from './page-toolbar/page-toolbar.component';
import { PageToolbarButtonComponent } from './page-toolbar-button/page-toolbar-button.component';
import { PageContainerComponent } from './page-container/page-container.component';

const COMPONENTS = [
  BigButtonComponent,
  PageToolbarComponent,
  PageContainerComponent,
  PageToolbarButtonComponent,
];

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class SharedModule {}
