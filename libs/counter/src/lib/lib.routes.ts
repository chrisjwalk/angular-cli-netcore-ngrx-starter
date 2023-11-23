import { Route } from '@angular/router';

import { CounterContainerComponent } from './containers/counter-container/counter-container.component';
import { CounterStore } from './state';

export const counterRoutes: Route[] = [
  {
    path: '',
    component: CounterContainerComponent,
    providers: [CounterStore],
  },
];
