import { Route } from '@angular/router';
import { requiresLoginCanActivateFn } from '@myorg/auth';

import { WeatherForecastComponent } from './components/weather-forecast/weather-forecast.component';
import { WeatherForecastStore } from './state/weather-forecast.store';

export const weatherForecastRoutes: Route[] = [
  {
    path: '',
    component: WeatherForecastComponent,
    providers: [WeatherForecastStore],
  },
  {
    path: 'plus',
    component: WeatherForecastComponent,
    providers: [WeatherForecastStore],
    canActivate: [requiresLoginCanActivateFn],
  },
];
