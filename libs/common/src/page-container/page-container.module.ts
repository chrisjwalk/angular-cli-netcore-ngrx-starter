import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PageContainerComponent } from './page-container.component';


@NgModule({
  imports: [CommonModule],
  declarations: [PageContainerComponent],
  exports: [PageContainerComponent],
})
export class PageContainerModule {}
