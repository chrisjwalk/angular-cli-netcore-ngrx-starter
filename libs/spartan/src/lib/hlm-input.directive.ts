import { Directive } from '@angular/core';
import { BrnInput } from '@spartan-ng/brain/input';

@Directive({
  selector: 'input[hlmInput], textarea[hlmInput]',
  standalone: true,
  hostDirectives: [{ directive: BrnInput, inputs: ['id', 'forceInvalid'] }],
  host: {
    class:
      'flex h-9 w-full rounded-md border border-outline-variant bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
  },
})
export class HlmInput {}
