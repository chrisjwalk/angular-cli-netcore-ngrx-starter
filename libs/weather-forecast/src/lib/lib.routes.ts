import { Route } from '@angular/router';
import {
  requiresLoginCanActivateFn,
  requiresLoginCanDeactivateFn,
} from '@myorg/auth';

import { WeatherForecast } from './components/weather-forecast/weather-forecast';

export const weatherForecastRoutes: Route[] = [
  {
    path: '',
    component: WeatherForecast,
  },
  {
    path: 'plus',
    component: WeatherForecast,
    canActivate: [requiresLoginCanActivateFn],
    canDeactivate: [requiresLoginCanDeactivateFn],
  },
];
