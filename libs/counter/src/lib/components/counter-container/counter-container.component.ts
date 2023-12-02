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

import { CounterStore } from '../../state';
import { CounterComponent } from '../counter/counter.component';

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
    @if (vm(); as vm) {
      <lib-page-toolbar [title]="vm.title">
        <lib-page-toolbar-button
          (click)="store.incrementCount()"
          tooltip="Increment!"
        >
          <mat-icon>add</mat-icon>
        </lib-page-toolbar-button>
      </lib-page-toolbar>
      <lib-page-container>
        <lib-counter
          [count]="vm.count"
          (increment)="store.incrementCount()"
          (decrement)="store.decrementCount()"
          (setCount)="store.setCount($event)"
        />
      </lib-page-container>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterContainerComponent implements OnInit {
  private layoutStore = inject(LayoutStore);

  store = inject(CounterStore);
  vm = computed(() => ({
    ...getState(this.layoutStore),
    ...getState(this.store),
  }));

  @HostBinding('attr.data-testid') testid = 'lib-counter-container';

  ngOnInit() {
    this.layoutStore.setTitle('Lazy Loaded Feature');
  }
}
