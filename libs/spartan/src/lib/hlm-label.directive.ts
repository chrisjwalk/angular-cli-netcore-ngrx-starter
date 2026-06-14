import { Directive } from '@angular/core';
import { BrnLabel } from '@spartan-ng/brain/label';

@Directive({
  selector: 'label[hlmLabel]',
  standalone: true,
  hostDirectives: [{ directive: BrnLabel, inputs: ['id', 'for'] }],
  host: {
    class:
      'text-xs font-semibold text-on-surface-variant peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1',
  },
})
export class HlmLabel {}
