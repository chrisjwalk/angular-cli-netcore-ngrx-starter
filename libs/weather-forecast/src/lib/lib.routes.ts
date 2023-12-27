import { Route } from '@angular/router';
import {
  requiresLoginCanActivateFn,
  requiresLoginCanDeactivateFn,
} from '@myorg/auth';

import { WeatherForecastComponent } from './components/weather-forecast/weather-forecast.component';

export const weatherForecastRoutes: Route[] = [
  {
    path: '',
    component: WeatherForecastComponent,
  },
  {
    path: 'plus',
    component: WeatherForecastComponent,
    canActivate: [requiresLoginCanActivateFn],
    canDeactivate: [requiresLoginCanDeactivateFn],
  },
];
