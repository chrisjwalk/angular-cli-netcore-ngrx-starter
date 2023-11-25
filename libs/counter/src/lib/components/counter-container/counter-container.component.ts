import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  LayoutStore,
  PageContainerComponent,
  PageToolbarButtonComponent,
  PageToolbarComponent,
} from '@myorg/shared';
import { getState } from '@ngrx/signals';

import { CounterComponent } from '../counter/counter.component';
import { CounterStore } from '../../state';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    PageContainerComponent,
    PageToolbarComponent,
    PageToolbarButtonComponent,
    CounterComponent,
  ],
  selector: 'lib-counter-container',
  template: `
    <ng-container *ngIf="vm() as vm">
      <lib-page-toolbar [title]="vm.title">
        <lib-page-toolbar-button
          (click)="counterStore.incrementCount()"
          tooltip="Increment!"
        >
          <mat-icon>add</mat-icon>
        </lib-page-toolbar-button>
      </lib-page-toolbar>
      <lib-page-container>
        <lib-counter
          [count]="vm.count"
          (increment)="counterStore.incrementCount()"
          (decrement)="counterStore.decrementCount()"
          (setCount)="counterStore.setCount($event)"
        >
        </lib-counter>
      </lib-page-container>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterContainerComponent implements OnInit {
  counterStore = inject(CounterStore);
  layoutStore = inject(LayoutStore);

  vm = computed(() => ({
    ...getState(this.layoutStore),
    ...getState(this.counterStore),
  }));

  @HostBinding('attr.data-testid') get testId() {
    return 'lib-counter-container';
  }

  ngOnInit() {
    this.layoutStore.setTitle('Lazy Loaded Feature');
  }
}
