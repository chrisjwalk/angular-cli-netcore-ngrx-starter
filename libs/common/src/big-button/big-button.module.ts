import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { BigButtonComponent } from './big-button.component';

@NgModule({
  imports: [CommonModule, MatButtonModule],
  declarations: [BigButtonComponent],
  exports: [BigButtonComponent],
})
export class BigButtonModule {}
