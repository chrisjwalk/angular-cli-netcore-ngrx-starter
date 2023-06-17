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
import { BigButtonComponent } from '@myorg/common/big-button';

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
  selector: 'lib-feature-component',
  templateUrl: './feature-component.component.html',
  styleUrls: ['./feature-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureComponentComponent {
  @Input() count: number;
  @Output() increment = new EventEmitter();
  @Output() decrement = new EventEmitter();
  @Output() setCount = new EventEmitter<number>();
}
