import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
  inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  LayoutStore,
  PageContainerComponent,
  PageToolbarButtonComponent,
  PageToolbarComponent,
} from '@myorg/shared';

import { CounterComponent } from '../../components/counter/counter.component';
import { CounterStore } from '../../data-access';

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
  counterService = inject(CounterStore);
  layoutService = inject(LayoutStore);

  @HostBinding('attr.data-testid') get testId() {
    return 'lib-counter-container';
  }

  ngOnInit() {
    this.layoutService.setTitle('Lazy Loaded Feature');
  }
}
