import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
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
      /* Style the internal BrnCheckbox button */
      :host ::ng-deep [role='checkbox'] {
        height: 1rem;
        width: 1rem;
        flex-shrink: 0;
        border-radius: 0.125rem;
        border: 1px solid var(--md-sys-color-outline-variant);
      }
      :host ::ng-deep [role='checkbox'][data-state='checked'] {
        background-color: var(--md-sys-color-primary);
        border-color: var(--md-sys-color-primary);
        color: var(--md-sys-color-on-primary);
      }
    `,
  ],
  host: {
    'data-testid': 'hlm-checkbox',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmCheckbox {
  readonly checked = input<unknown>();
  readonly disabled = input<unknown>();
  readonly required = input<unknown>();
  readonly id = input<string>();
  readonly name = input<string>();
  readonly ariaLabel = input<string>();
  readonly ariaLabelledby = input<string>();
  readonly ariaDescribedby = input<string>();
  readonly checkedChange = output<boolean>();
}
