import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { LayoutStore, PageContainer, PageToolbar } from '@myorg/shared';

import { counterEvents, CounterStore } from '../../state';
import { Counter } from '../counter/counter';
import { injectDispatch } from '@ngrx/signals/events';

@Component({
  imports: [PageContainer, PageToolbar, Counter],
  selector: 'lib-counter-container',
  template: `
    @let count = store.count();
    <lib-page-toolbar [title]="layoutStore.title()" />
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
export class CounterContainer {
  readonly layoutStore = inject(LayoutStore);
  readonly store = inject(CounterStore);
  readonly dispatcher = injectDispatch(counterEvents);

  count = input<number | string>(null);

  constructor() {
    this.layoutStore.setTitle('Lazy Loaded Feature');
    this.store.inputCount(this.count);
  }
}
