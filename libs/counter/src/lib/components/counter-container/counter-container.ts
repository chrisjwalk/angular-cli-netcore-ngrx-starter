import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { CounterStore } from '../../state';
import { Counter } from '../counter/counter';

@Component({
  imports: [Counter],
  selector: 'lib-counter-container',
  template: `
    @let count = store.count();
    <lib-counter
      #counter
      [count]="count"
      (increment)="store.incrementCount()"
      (decrement)="store.decrementCount()"
      (setCount)="store.setCount($event)"
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

  count = input<number | string>(null);

  constructor() {
    this.store.inputCount(this.count);
  }
}
