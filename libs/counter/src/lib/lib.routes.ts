import { Route } from '@angular/router';

import { CounterContainer } from './components/counter-container/counter-container';

export const counterRoutes: Route[] = [
  {
    path: '',
    title: 'Counter',
    component: CounterContainer,
  },
];
