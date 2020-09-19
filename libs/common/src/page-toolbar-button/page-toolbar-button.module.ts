import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PageToolbarButtonComponent } from './page-toolbar-button.component';

@NgModule({
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  declarations: [PageToolbarButtonComponent],
  exports: [PageToolbarButtonComponent],
})
export class PageToolbarButtonModule {}
