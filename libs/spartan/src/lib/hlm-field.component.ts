import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrnField } from '@spartan-ng/brain/field';

@Component({
  selector: 'hlm-field',
  standalone: true,
  hostDirectives: [
    { directive: BrnField, inputs: ['data-invalid', 'forceInvalid'] },
  ],
  template: `<ng-content />`,
  host: {
    class: 'block',
    'data-spartan': 'hlm-field',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmField {}
