import { Directive } from '@angular/core';
import { BrnTooltip } from '@spartan-ng/brain/tooltip';

@Directive({
  selector: '[hlmTooltip]',
  standalone: true,
  hostDirectives: [
    {
      directive: BrnTooltip,
      inputs: ['brnTooltip: hlmTooltip', 'position', 'showDelay', 'hideDelay'],
    },
  ],
})
export class HlmTooltip {}
