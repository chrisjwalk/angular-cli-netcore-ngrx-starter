import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BigButtonComponent } from '@myorg/shared';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    BigButtonComponent,
    MatTooltipModule,
  ],
  selector: 'lib-counter',
  template: `
    <div class="count-row">
      <button
        mat-icon-button
        (click)="decrement.emit()"
        matTooltip="Decrement"
        aria-label="Decrement"
      >
        <mat-icon>keyboard_arrow_left</mat-icon>
      </button>
      <mat-card>
        <mat-card-content>
          <p class="count" data-testid="count">{{ count }}</p>
        </mat-card-content>
      </mat-card>
      <button
        mat-icon-button
        (click)="increment.emit()"
        matTooltip="Increment"
        aria-label="Increment"
      >
        <mat-icon>keyboard_arrow_right</mat-icon>
      </button>
    </div>
    <mat-form-field appearance="outline">
      <mat-label>Enter the value you'd like to set the count to here</mat-label>
      <input
        matInput
        #setvalue
        type="number"
        placeholder="Set Count"
        (keyup.enter)="setCount.emit(+setvalue.value)"
        [value]="count"
      />
    </mat-form-field>
    <lib-big-button (click)="setCount.emit(+setvalue.value)">
      Submit
    </lib-big-button>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        gap: 16px;
        align-items: center;

        .count-row,
        .set-row {
          display: flex;
          flex-direction: row;
          box-sizing: border-box;
          align-items: center;
          align-content: center;
          justify-content: center;
          white-space: nowrap;
          width: 100%;
        }

        .count-row {
          display: flex;
          gap: 8px;
          .mat-mdc-card {
            @media (min-width: 600px) {
              min-width: 300px;
            }

            @media (max-width: 599px) {
              min-width: calc(100% - 220px);
            }

            text-overflow: ellipsis;
            overflow: hidden;
          }

          p.count {
            text-align: center;
            font-size: 120px;
            margin: 0;
          }

          .mat-mdc-icon-button {
            height: 92px;
            width: 92px;
          }

          .mat-mdc-icon {
            font-size: 76px;
            height: 76px;
            width: 76px;
            line-height: 76px;
          }
        }

        .mat-mdc-form-field {
          margin-top: 4px;
          width: 320px;

          ::ng-deep .mat-mdc-form-field-subscript-wrapper {
            display: none;
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent {
  @Input() count: number;
  @Output() increment = new EventEmitter();
  @Output() decrement = new EventEmitter();
  @Output() setCount = new EventEmitter<number>();
}
