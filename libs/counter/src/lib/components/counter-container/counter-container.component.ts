import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  LayoutStore,
  PageContainerComponent,
  PageToolbarButtonComponent,
  PageToolbarComponent,
} from '@myorg/shared';

import { counterEvents, CounterStore } from '../../state';
import { CounterComponent } from '../counter/counter.component';
import { injectDispatch } from '@ngrx/signals/events';

@Component({
  imports: [
    MatIconModule,
    PageContainerComponent,
    PageToolbarComponent,
    PageToolbarButtonComponent,
    CounterComponent,
  ],
  selector: 'lib-counter-container',
  template: `
    @let count = store.count();
    <lib-page-toolbar [title]="layoutStore.title()">
      <lib-page-toolbar-button
        (click)="dispatcher.incrementCount()"
        tooltip="Increment!"
      >
        <mat-icon>add</mat-icon>
      </lib-page-toolbar-button>
    </lib-page-toolbar>
    <lib-page-container>
      <lib-counter
        #counter
        [count]="count"
        (increment)="dispatcher.incrementCount()"
        (decrement)="dispatcher.decrementCount()"
        (setCount)="dispatcher.setCount($event)"
      />
    </lib-page-container>
  `,
  host: {
    'data-testid': 'lib-counter-container',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterContainerComponent {
  readonly layoutStore = inject(LayoutStore);
  readonly store = inject(CounterStore);
  readonly dispatcher = injectDispatch(counterEvents);

  count = input<number | string>(null);

  constructor() {
    this.layoutStore.setTitle('Lazy Loaded Feature');
    this.store.inputCount(this.count);
  }
}
