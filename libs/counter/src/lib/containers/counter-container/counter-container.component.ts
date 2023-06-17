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
  LayoutFacade,
  PageContainerComponent,
  PageToolbarButtonComponent,
  PageToolbarComponent,
} from '@myorg/shared';

import { CounterComponent } from '../../components/counter/counter.component';
import { CounterFacade } from '../../store/facades';

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
  @HostBinding('attr.data-testid') get testId() {
    return 'lib-counter-container';
  }

  CounterFacade = inject(CounterFacade);
  layoutFacade = inject(LayoutFacade);

  ngOnInit() {
    this.layoutFacade.setTitle('Lazy Loaded Feature');
  }
}
