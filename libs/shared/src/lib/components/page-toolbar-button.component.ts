import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  selector: 'lib-page-toolbar-button',
  template: `
    <button
      mat-icon-button
      [attr.aria-label]="tooltip"
      [matTooltip]="tooltip"
      [matTooltipDisabled]="tooltipDisabled"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        .mdc-icon-button {
          @apply flex;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageToolbarButtonComponent implements OnInit {
  @Input() tooltip: string;
  tooltipDisabled: boolean;

  ngOnInit() {
    this.tooltipDisabled = !this.tooltip;
  }
}
