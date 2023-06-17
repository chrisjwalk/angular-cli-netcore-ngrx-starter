import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { WeatherForecastStore } from '../services/weather-forecast.store';

export const forecastsCanActivateFn: CanActivateFn = () => {
  const weatherForecastStore = inject(WeatherForecastStore);

  return weatherForecastStore.count$.pipe(
    tap((count) => (!count ? weatherForecastStore.getForecasts(10) : null)),
    map(() => true),
    catchError(() => of(false)),
  );
};
