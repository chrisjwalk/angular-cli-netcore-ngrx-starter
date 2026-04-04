import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  imports: [
    MatButton,
    MatIconButton,
    MatIcon,
    MatFormField,
    MatInput,
    MatTooltip,
    MatLabel,
  ],
  selector: 'lib-counter',
  template: `
    <div
      class="w-full overflow-hidden rounded-2xl bg-surface-container-low shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_24px_48px_rgba(0,0,0,0.4)]"
    >
      <!-- Counter display -->
      <div class="flex flex-col items-center gap-8 px-8 py-12">
        <div class="flex items-center gap-8">
          <button
            class="!h-[72px] !w-[72px]"
            mat-icon-button
            (click)="decrement.emit()"
            matTooltip="Decrement"
            aria-label="Decrement"
          >
            <mat-icon class="!h-[56px] !w-[56px] !text-[60px]">remove</mat-icon>
          </button>
          <div
            class="min-w-[200px] text-center font-display text-[120px] font-black leading-none tracking-tight text-on-surface"
            data-testid="count"
          >
            {{ count() }}
          </div>
          <button
            class="!h-[72px] !w-[72px]"
            mat-icon-button
            (click)="increment.emit()"
            matTooltip="Increment"
            aria-label="Increment"
          >
            <mat-icon class="!h-[56px] !w-[56px] !text-[60px]">add</mat-icon>
          </button>
        </div>

        <!-- Set value -->
        <div class="flex items-center gap-3">
          <mat-form-field appearance="outline">
            <mat-label>Set Count</mat-label>
            <input
              matInput
              #setvalue
              type="number"
              (keyup.enter)="setCount.emit(+setvalue.value)"
              [value]="count()"
            />
          </mat-form-field>
          <button
            mat-flat-button
            color="primary"
            (click)="setCount.emit(+setvalue.value)"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  `,

  styles: [
    `
      :host ::ng-deep .mat-mdc-form-field-subscript-wrapper {
        display: none;
      }
    `,
  ],
  host: {
    class: 'flex w-full',
    'data-testid': 'lib-counter',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Counter {
  count = input<number>(null);

  increment = output();
  decrement = output();
  setCount = output<number>();
}
