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

import { CounterStore } from '../../state';
import { CounterComponent } from '../counter/counter.component';

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
        (click)="store.incrementCount()"
        tooltip="Increment!"
      >
        <mat-icon>add</mat-icon>
      </lib-page-toolbar-button>
    </lib-page-toolbar>
    <lib-page-container>
      <lib-counter
        #counter
        [count]="count"
        (increment)="store.incrementCount()"
        (decrement)="store.decrementCount()"
        (setCount)="store.setCount($event)"
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

  count = input<number | string>(null);

  constructor() {
    this.layoutStore.setTitle('Lazy Loaded Feature');
    this.store.inputCount(this.count);
  }
}
