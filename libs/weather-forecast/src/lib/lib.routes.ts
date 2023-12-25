import { Route } from '@angular/router';
import {
  requiresLoginCanActivateFn,
  requiresLoginCanDeactivateFn,
} from '@myorg/auth';

import { WeatherForecastComponent } from './components/weather-forecast/weather-forecast.component';
import { WeatherForecastStore } from './state/weather-forecast.store';

export const weatherForecastRoutes: Route[] = [
  {
    path: '',
    component: WeatherForecastComponent,
    data: { plus: false },
    providers: [WeatherForecastStore],
  },
  {
    path: 'plus',
    component: WeatherForecastComponent,
    data: { plus: true },
    providers: [WeatherForecastStore],
    canActivate: [requiresLoginCanActivateFn],
    canDeactivate: [requiresLoginCanDeactivateFn],
  },
];
