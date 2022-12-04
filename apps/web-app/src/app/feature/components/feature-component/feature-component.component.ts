import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { SharedModule } from '../../../shared';
import { MaterialModule } from '../../../shared/material';

@Component({
  standalone: true,
  imports: [CommonModule, MaterialModule, SharedModule],
  selector: 'app-feature-component',
  templateUrl: './feature-component.component.html',
  styleUrls: ['./feature-component.component.scss'],
})
export class FeatureComponentComponent {
  @Input() count: number;
  @Output() increment = new EventEmitter();
  @Output() decrement = new EventEmitter();
  @Output() setCount = new EventEmitter<number>();
}
