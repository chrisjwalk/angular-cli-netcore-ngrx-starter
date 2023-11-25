import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  selector: 'lib-big-button',
  template: `
    <button mat-button>
      <ng-content></ng-content>
    </button>
  `,
  styles: [
    `
      :host .mat-mdc-button {
        background-color: rgba(0, 0, 0, 0.12);
        margin: 0px 4px;

        &:first-child {
          margin-left: 0;
        }

        &:last-child {
          margin-right: 0;
        }

        line-height: 42px;
        font-size: 16px;

        .mat-mdc-icon {
          height: 28px;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BigButtonComponent {}
