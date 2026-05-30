import { Route } from '@angular/router';
import { counterRoutes } from '@myorg/counter';

export const routes: Route[] = [
  ...counterRoutes,
  { path: '**', redirectTo: '' },
];
