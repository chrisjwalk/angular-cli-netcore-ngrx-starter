import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Output,
  input,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BigButtonComponent } from '@myorg/shared';

@Component({
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    BigButtonComponent,
    MatTooltipModule,
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
        class="bg-white/95 dark:bg-neutral-700 p-4 rounded flex flex-col shadow truncate min-[600px]:min-w-[300px] max-[599px]:flex-1"
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
    <lib-big-button (click)="setCount.emit(+setvalue.value)">
      Submit
    </lib-big-button>
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent {
  @HostBinding('attr.data-testid') testid = 'lib-counter';

  @HostBinding('class') class = 'flex flex-col gap-4 items-center';

  count = input<number>(null);

  @Output() increment = new EventEmitter();
  @Output() decrement = new EventEmitter();
  @Output() setCount = new EventEmitter<number>();
}
