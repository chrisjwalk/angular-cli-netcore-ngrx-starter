import { NgModule } from '@angular/core';
import { BigButtonComponent } from '@myorg/common/big-button';
import { PageContainerComponent } from '@myorg/common/page-container';
import { PageToolbarComponent } from '@myorg/common/page-toolbar';
import { PageToolbarButtonComponent } from '@myorg/common/page-toolbar-button';

@NgModule({
  imports: [
    BigButtonComponent,
    PageContainerComponent,
    PageToolbarComponent,
    PageToolbarButtonComponent,
  ],
  exports: [
    BigButtonComponent,
    PageContainerComponent,
    PageToolbarComponent,
    PageToolbarButtonComponent,
  ],
})
export class SharedModule {}
