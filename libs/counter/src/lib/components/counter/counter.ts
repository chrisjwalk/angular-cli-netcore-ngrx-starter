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
      class="count-row flex gap-2 items-center content-center justify-center w-full whitespace-nowrap"
    >
      <button
        class="!w-[92px] !h-[92px]"
        mat-icon-button
        (click)="decrement.emit()"
        matTooltip="Decrement"
        aria-label="Decrement"
      >
        <mat-icon class="!w-[72px] !h-[72px] !text-[76px]">
          keyboard_arrow_left
        </mat-icon>
      </button>
      <div
        class="bg-white/95 dark:bg-neutral-700 p-4 rounded-sm flex flex-col shadow-sm truncate min-[600px]:min-w-[300px] max-[599px]:flex-1"
      >
        <div class="text-[120px] text-center" data-testid="count">
          {{ count() }}
        </div>
      </div>
      <button
        class="!w-[92px] !h-[92px]"
        mat-icon-button
        (click)="increment.emit()"
        matTooltip="Increment"
        aria-label="Increment"
      >
        <mat-icon class="!w-[72px] !h-[72px] !text-[76px]">
          keyboard_arrow_right
        </mat-icon>
      </button>
    </div>
    <mat-form-field appearance="outline" class="mt-1 w-[320px]">
      <mat-label>
        Enter the value you'd like to set the count to here
      </mat-label>
      <input
        matInput
        #setvalue
        type="number"
        placeholder="Set Count"
        (keyup.enter)="setCount.emit(+setvalue.value)"
        [value]="count()"
      />
    </mat-form-field>
    <button
      mat-button
      class="!text-base/10 dark:!bg-neutral-900"
      (click)="setCount.emit(+setvalue.value)"
    >
      Submit
    </button>
  `,
  styles: [
    `
      :host ::ng-deep {
        .mat-mdc-form-field {
          .mat-mdc-form-field-subscript-wrapper {
            display: none;
          }
        }
      }
    `,
  ],
  host: {
    class: 'flex flex-col gap-4 items-center',
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
