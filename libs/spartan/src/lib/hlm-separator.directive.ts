import { Directive } from '@angular/core';
import { BrnSeparator } from '@spartan-ng/brain/separator';

@Directive({
  selector: '[hlmSeparator]',
  standalone: true,
  hostDirectives: [
    {
      directive: BrnSeparator,
      inputs: ['orientation', 'decorative'],
    },
  ],
  host: {
    class:
      'shrink-0 bg-outline-variant data-[orientation=horizontal]:h-[1px] data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-[1px]',
    'data-spartan': 'hlm-separator',
  },
})
export class HlmSeparator {}
