import { Route } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';

import { WeatherForecastComponent } from './containers/weather-forecast/weather-forecast.component';
import { forecastsCanActivateFn } from './guards/weather-forecast.guard';
import { WeatherForecastStore } from './services/weather-forecast.store';

export const weatherForecastRoutes: Route[] = [
  {
    path: '',
    component: WeatherForecastComponent,
    canActivate: [forecastsCanActivateFn],
    providers: [provideComponentStore(WeatherForecastStore)],
  },
];
