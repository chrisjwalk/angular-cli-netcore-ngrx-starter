import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
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
  standalone: true,
  imports: [
    MatIconModule,
    PageContainerComponent,
    PageToolbarComponent,
    PageToolbarButtonComponent,
    CounterComponent,
  ],
  selector: 'lib-counter-container',
  template: `
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
        [count]="store.count()"
        (increment)="store.incrementCount()"
        (decrement)="store.decrementCount()"
        (setCount)="store.setCount($event)"
      />
    </lib-page-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterContainerComponent implements OnInit {
  @HostBinding('attr.data-testid') testid = 'lib-counter-container';

  readonly layoutStore = inject(LayoutStore);
  readonly store = inject(CounterStore);

  count = input<number | string>(null);

  ngOnInit() {
    this.layoutStore.setTitle('Lazy Loaded Feature');
    this.store.inputCount(this.count);
  }
}
