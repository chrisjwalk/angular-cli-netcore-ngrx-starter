import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadChildren: () => import('@myorg/home').then((m) => m.homeRoutes),
  },
  {
    path: 'feature',
    loadChildren: () => import('@myorg/counter').then((m) => m.counterRoutes),
  },
  {
    path: 'weather-forecast',
    loadChildren: () =>
      import('@myorg/weather-forecast').then((m) => m.weatherForecastRoutes),
  },
  {
    path: 'login',
    loadChildren: () => import('@myorg/login').then((m) => m.loginRoutes),
  },
  { path: '**', redirectTo: '' },
];
