import { Route } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';

import { FetchDataComponent } from './containers/fetch-data/fetch-data.component';
import { forecastsCanActivateFn } from './guards/weather-forecast.guard';
import { WeatherForecastStore } from './services/weather-forecast.store';

export const weatherForecastRoutes: Route[] = [
  {
    path: '',
    component: FetchDataComponent,
    canActivate: [forecastsCanActivateFn],
    providers: [provideComponentStore(WeatherForecastStore)],
  },
];
