import { isPlatformServer } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, skip, switchMap, takeUntil } from 'rxjs/operators';

import { WeatherForecast } from 'app/forecasts/models/weather-forecast';
import { ForecastsService } from 'app/forecasts/services/forecasts.service';
import * as forecastsActions from 'app/forecasts/store/actions';

@Injectable()
export class ForecastEffects {
  constructor(
    private actions$: Actions,
    private weatherService: ForecastsService,
    private snackBar: MatSnackBar,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: object,
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
    const stateKey = makeStateKey('getWeather_' + count.toString());

    if (this.transferState.hasKey(stateKey)) {
      const weatherForecasts = this.transferState.get<WeatherForecast[]>(
        stateKey,
        [],
      );
      this.transferState.remove(stateKey);
      return of(forecastsActions.loadComplete({ weatherForecasts }));
    } else {
      return this.weatherService.getWeather<WeatherForecast>(count).pipe(
        takeUntil(nextLoad$),
        map((weatherForecasts: WeatherForecast[]) => {
          if (isPlatformServer(this.platformId)) {
            this.transferState.set<WeatherForecast[]>(
              stateKey,
              weatherForecasts,
            );
          }
          return forecastsActions.loadComplete({ weatherForecasts });
        }),
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            const message = `ERROR: ${err.status} - ${err.statusText} - URL: ${
              err.url
            }`;
            this.snackBar.open(message, null, {
              duration: 6000,
            });
          }
          return of(forecastsActions.loadError(err));
        }),
      );
    }
  }
}
