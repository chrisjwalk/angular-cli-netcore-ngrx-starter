import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BigButtonComponent } from './big-button/big-button.component';
import { MaterialModule } from './material';
import { PageContainerComponent } from './page-container/page-container.component';
import { PageToolbarButtonComponent } from './page-toolbar-button/page-toolbar-button.component';
import { PageToolbarComponent } from './page-toolbar/page-toolbar.component';


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
