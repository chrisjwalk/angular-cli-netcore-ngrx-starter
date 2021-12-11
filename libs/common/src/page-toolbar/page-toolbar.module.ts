import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PageToolbarComponent } from './page-toolbar.component';

@NgModule({
  imports: [CommonModule],
  declarations: [PageToolbarComponent],
  exports: [PageToolbarComponent],
})
export class PageToolbarModule {}
