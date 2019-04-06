import { isPlatformServer } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
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
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  @Effect()
  load$: Observable<Action> = this.actions$.pipe(
    ofType<forecastsActions.Load>(forecastsActions.ForecastActionTypes.Load),
    map(action => action.payload),
    switchMap(count => this.runQuery(count))
  );

  @Effect()
  refresh$: Observable<Action> = this.actions$.pipe(
    ofType<forecastsActions.Refresh>(forecastsActions.ForecastActionTypes.Refresh),
    map(action => action.payload),
    switchMap(count => this.runQuery(count))
  );

  runQuery(count: number) {
    const nextLoad$ = this.actions$.pipe(
      ofType(forecastsActions.ForecastActionTypes.Load),
      skip(1)
    );
    const stateKey = makeStateKey('getWeather_' + count.toString());

    if (this.transferState.hasKey(stateKey)) {
      const weatherForecast = this.transferState.get<WeatherForecast[]>(stateKey, []);
      this.transferState.remove(stateKey);
      return of(new forecastsActions.LoadComplete(weatherForecast));
    } else {
      return this.weatherService
        .getWeather<WeatherForecast>(count)
        .pipe(
        takeUntil(nextLoad$),
        map((weatherForecast: WeatherForecast[]) => {
          if (isPlatformServer(this.platformId)) {
            this.transferState.set<WeatherForecast[]>(stateKey, weatherForecast);
          }
          return new forecastsActions.LoadComplete(weatherForecast);
        }),
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            const message = `ERROR: ${err.status} - ${err.statusText} - URL: ${err.url}`;
            this.snackBar.open(message, null, {
              duration: 6000,
            });
          }
          return of(new forecastsActions.LoadError(err));
        })
        );
    }
  }
}
