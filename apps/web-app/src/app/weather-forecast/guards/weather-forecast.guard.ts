import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';

import { WeatherForecastService } from '../services/weather-forecast.service';

@Injectable({
  providedIn: 'root',
})
export class ForecastsGuard implements CanActivate {
  constructor(private weatherForecastService: WeatherForecastService) {}

  getFromStoreOrAPI(): Observable<any> {
    return this.weatherForecastService.count$.pipe(
      tap((count) => {
        if (!count) {
          this.weatherForecastService.getForecasts();
        }
      }),
      take(1),
    );
  }

  canActivate(): Observable<boolean> {
    return this.getFromStoreOrAPI().pipe(
      switchMap(() => of(true)),
      catchError(() => of(false)),
    );
  }
}
