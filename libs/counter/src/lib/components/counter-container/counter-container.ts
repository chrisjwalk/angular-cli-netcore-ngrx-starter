import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { counterEvents, CounterStore } from '../../state';
import { Counter } from '../counter/counter';
import { injectDispatch } from '@ngrx/signals/events';

@Component({
  imports: [Counter],
  selector: 'lib-counter-container',
  providers: [CounterStore],
  template: `
    @let count = store.count();
    <lib-counter
      #counter
      [count]="count"
      (increment)="dispatcher.incrementCount()"
      (decrement)="dispatcher.decrementCount()"
      (setCount)="dispatcher.setCount($event)"
    />
  `,
  host: {
    class: 'block p-4',
    'data-testid': 'lib-counter-container',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterContainer {
  readonly store = inject(CounterStore);
  readonly dispatcher = injectDispatch(counterEvents);

  count = input<number | string>(null);

  constructor() {
    this.store.inputCount(this.count);
  }
}
