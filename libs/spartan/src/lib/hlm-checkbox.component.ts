import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { BrnCheckboxImports } from '@spartan-ng/brain/checkbox';

@Component({
  selector: 'hlm-checkbox',
  standalone: true,
  imports: [BrnCheckboxImports],
  template: `
    <brn-checkbox
      [checked]="checked()"
      [disabled]="disabled()"
      [required]="required()"
      [id]="id()"
      [name]="name()"
      [aria-label]="ariaLabel()"
      [aria-labelledby]="ariaLabelledby()"
      [aria-describedby]="ariaDescribedby()"
      (checkedChange)="checkedChange.emit($event)"
    >
      <ng-content />
    </brn-checkbox>
  `,
  styles: [
    `
      :host ::ng-deep [role='checkbox'] {
        height: 1.125rem;
        width: 1.125rem;
        flex-shrink: 0;
        border-radius: 0.125rem;
        border: 2px solid var(--md-sys-color-on-surface-variant);
        background: transparent;
        cursor: pointer;
        transition:
          background-color 0.15s,
          border-color 0.15s;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
      }
      :host ::ng-deep [role='checkbox'][data-state='checked'] {
        background-color: var(--md-sys-color-primary);
        border-color: var(--md-sys-color-primary);
      }
      :host ::ng-deep [role='checkbox'][data-state='checked']::after {
        content: '';
        display: block;
        width: 5px;
        height: 9px;
        border: solid var(--md-sys-color-on-primary);
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
        margin-top: -2px;
      }
    `,
  ],
  host: {
    'data-testid': 'hlm-checkbox',
    'data-spartan': 'hlm-checkbox',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmCheckbox {
  readonly checked = input<boolean | string>();
  readonly disabled = input<boolean | string>();
  readonly required = input<boolean | string>();
  readonly id = input<string>();
  readonly name = input<string>();
  readonly ariaLabel = input<string>();
  readonly ariaLabelledby = input<string>();
  readonly ariaDescribedby = input<string>();
  readonly checkedChange = output<boolean>();
}
