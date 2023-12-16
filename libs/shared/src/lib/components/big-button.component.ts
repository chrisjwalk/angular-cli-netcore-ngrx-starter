import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [MatButtonModule],
  selector: 'lib-big-button',
  template: `
    <button
      data-testid="lib-big-button"
      mat-button
      class="!text-base/10 !bg-neutral-900"
    >
      <ng-content />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BigButtonComponent {}
