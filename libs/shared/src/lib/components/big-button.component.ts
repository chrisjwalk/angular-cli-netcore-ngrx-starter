import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  selector: 'lib-big-button',
  template: `
    <button mat-button class="!text-base/10 !bg-neutral-900">
      <ng-content></ng-content>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BigButtonComponent {}
