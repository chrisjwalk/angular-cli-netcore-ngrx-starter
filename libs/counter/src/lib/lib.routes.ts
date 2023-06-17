import { Route } from '@angular/router';

import { CounterContainerComponent } from './containers/counter-container/counter-container.component';

export const counterRoutes: Route[] = [
  { path: '', component: CounterContainerComponent },
];
