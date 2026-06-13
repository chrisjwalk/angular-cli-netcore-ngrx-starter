import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Minus, Plus, LucideAngularModule } from 'lucide-angular';

import {
  HlmButton,
  HlmField,
  HlmInput,
  HlmLabel,
  HlmTooltip,
} from '@myorg/spartan';

@Component({
  imports: [
    HlmButton,
    HlmField,
    HlmInput,
    HlmLabel,
    HlmTooltip,
    LucideAngularModule,
  ],
  selector: 'lib-counter',
  template: `
    <div
      class="w-full overflow-hidden rounded-2xl bg-surface-container-low shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_24px_48px_rgba(0,0,0,0.4)]"
    >
      <!-- Counter display -->
      <div class="flex flex-col items-center gap-8 px-4 py-8 sm:px-8 sm:py-12">
        <div class="flex items-center gap-4 sm:gap-8">
          <button
            hlmButton
            variant="ghost"
            size="icon-lg"
            (click)="decrement.emit()"
            [hlmTooltip]="'Decrement'"
            aria-label="Decrement"
          >
            <lucide-icon
              [name]="minusIcon"
              [size]="40"
              class="sm:!h-[56px] sm:!w-[56px]"
            />
          </button>
          <div
            class="min-w-[100px] text-center font-display text-[72px] font-black leading-none tracking-tight text-on-surface sm:min-w-[200px] sm:text-[120px]"
            data-testid="count"
          >
            {{ count() }}
          </div>
          <button
            hlmButton
            variant="ghost"
            size="icon-lg"
            (click)="increment.emit()"
            [hlmTooltip]="'Increment'"
            aria-label="Increment"
          >
            <lucide-icon
              [name]="plusIcon"
              [size]="40"
              class="sm:!h-[56px] sm:!w-[56px]"
            />
          </button>
        </div>

        <!-- Set value -->
        <div class="flex items-end gap-3">
          <hlm-field>
            <label hlmLabel for="set-count">Set Count</label>
            <input
              hlmInput
              id="set-count"
              #setvalue
              type="number"
              (keyup.enter)="setCount.emit(+setvalue.value)"
              [value]="count()"
            />
          </hlm-field>
          <button
            hlmButton
            variant="default"
            (click)="setCount.emit(+setvalue.value)"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  `,
  host: {
    class: 'flex w-full',
    'data-testid': 'lib-counter',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Counter {
  count = input<number>(null);

  readonly plusIcon = Plus;
  readonly minusIcon = Minus;

  increment = output();
  decrement = output();
  setCount = output<number>();
}
