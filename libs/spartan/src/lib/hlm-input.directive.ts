import { Directive } from '@angular/core';
import { BrnInput } from '@spartan-ng/brain/input';

@Directive({
  selector: 'input[hlmInput], textarea[hlmInput]',
  standalone: true,
  hostDirectives: [{ directive: BrnInput, inputs: ['id', 'forceInvalid'] }],
  host: {
    class:
      'flex h-11 w-full rounded-lg border border-outline-variant/30 bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-on-surface-variant/50 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
  },
})
export class HlmInput {}
