import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { WeatherForecast } from 'app/forecasts/models/weather-forecast';
import { ForecastsService } from 'app/forecasts/services/forecasts.service';
import * as forecastsActions from 'app/forecasts/store/actions';
import { of } from 'rxjs';
import { catchError, map, skip, switchMap, takeUntil } from 'rxjs/operators';

@Injectable()
export class ForecastEffects {
  constructor(
    private actions$: Actions,
    private weatherService: ForecastsService,
    private snackBar: MatSnackBar,
  ) {}

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(forecastsActions.load),
      map((action) => action.count),
      switchMap((count) => this.runQuery(count)),
    ),
  );

  refresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(forecastsActions.refresh),
      map((action) => action.count),
      switchMap((count) => this.runQuery(count)),
    ),
  );

  runQuery(count: number) {
    const nextLoad$ = this.actions$.pipe(
      ofType(forecastsActions.load),
      skip(1),
    );
    return this.weatherService.getWeather<WeatherForecast>(count).pipe(
      takeUntil(nextLoad$),
      map((weatherForecasts: WeatherForecast[]) => {
        return forecastsActions.loadComplete({ weatherForecasts });
      }),
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          const message = `ERROR: ${err.status} - ${err.statusText} - URL: ${err.url}`;
          this.snackBar.open(message, null, {
            duration: 6000,
          });
        }
        return of(forecastsActions.loadError(err));
      }),
    );
  }
}
