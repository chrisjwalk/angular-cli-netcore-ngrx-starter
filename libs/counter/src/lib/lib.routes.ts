import { Route } from '@angular/router';

import { CounterContainer } from './components/counter-container/counter-container';
import { CounterStore } from './state';

export const counterRoutes: Route[] = [
  {
    path: '',
    component: CounterContainer,
    providers: [CounterStore],
  },
];
