import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { WeatherForecastStore } from '../state/weather-forecast.store';

export const forecastsCanActivateFn: CanActivateFn = () => {
  const weatherForecastStore = inject(WeatherForecastStore);

  if (!weatherForecastStore.count()) {
    weatherForecastStore.getForecasts(10);
  }

  return true;
};
