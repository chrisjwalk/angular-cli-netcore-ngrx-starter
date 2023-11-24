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

import { CounterComponent } from '../../components/counter/counter.component';
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
  templateUrl: './counter-container.component.html',
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
