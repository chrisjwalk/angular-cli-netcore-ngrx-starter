import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BigButtonModule } from '@myorg/common/big-button';
import { PageContainerModule } from '@myorg/common/page-container';
import { PageToolbarModule } from '@myorg/common/page-toolbar';
import { PageToolbarButtonModule } from '@myorg/common/page-toolbar-button';

@NgModule({
  imports: [
    CommonModule,
    BigButtonModule,
    PageContainerModule,
    PageToolbarModule,
    PageToolbarButtonModule,
  ],
  exports: [
    BigButtonModule,
    PageContainerModule,
    PageToolbarModule,
    PageToolbarButtonModule,
  ],
})
export class SharedModule {}
