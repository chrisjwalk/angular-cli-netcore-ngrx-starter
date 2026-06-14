import { Provider } from '@angular/core';
import { provideBrnTooltipDefaultOptions } from '@spartan-ng/brain/tooltip';
import type { BrnTooltipOptions } from '@spartan-ng/brain/tooltip';

const tooltipOptions: Partial<BrnTooltipOptions> = {
  showDelay: 200,
  hideDelay: 150,
  tooltipContentClasses:
    'bg-inverse-surface text-inverse-on-surface text-xs font-medium px-2 py-1 rounded-md shadow-md',
};

/**
 * Provides default configuration for Spartan.ng brain primitives.
 * Add this to your app's providers array.
 */
export function provideSpartanConfig(): Provider[] {
  return [provideBrnTooltipDefaultOptions(tooltipOptions)];
}
