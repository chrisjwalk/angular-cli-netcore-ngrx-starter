import { Directive } from '@angular/core';
import { BrnLabel } from '@spartan-ng/brain/label';

@Directive({
  selector: 'label[hlmLabel]',
  standalone: true,
  hostDirectives: [{ directive: BrnLabel, inputs: ['id', 'for'] }],
  host: {
    class:
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1.5',
  },
})
export class HlmLabel {}
