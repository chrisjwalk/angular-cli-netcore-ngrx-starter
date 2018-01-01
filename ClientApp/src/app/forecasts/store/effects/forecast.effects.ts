import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { Scheduler } from 'rxjs/Scheduler';
import { async } from 'rxjs/scheduler/async';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap, debounceTime, skip, takeUntil } from 'rxjs/operators';

import { ForecastsService } from 'app/forecasts/services/forecasts.service';
import * as forecastsActions from 'app/forecasts/store/actions';
import { WeatherForecast } from 'app/forecasts/models/weather-forecast';

export const SEARCH_DEBOUNCE = new InjectionToken<number>('Load Debounce');
export const SEARCH_SCHEDULER = new InjectionToken<Scheduler>(
  'Load Scheduler'
);

@Injectable()
export class ForecastEffects {
  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(ForecastsService) private weatherService: ForecastsService,
    @Inject(MatSnackBar) private snackBar: MatSnackBar,
    @Optional()
    @Inject(SEARCH_DEBOUNCE)
    private debounce: number,
    /**
       * You inject an optional Scheduler that will be undefined
       * in normal application usage, but its injected here so that you can mock out
       * during testing using the RxJS TestScheduler for simulating passages of time.
       */
    @Optional()
    @Inject(SEARCH_SCHEDULER)
    private scheduler: Scheduler
  ) { }

  @Effect()
  load$: Observable<Action> = this.actions$
    .ofType<forecastsActions.Load>(forecastsActions.ForecastActionTypes.Load)
    .pipe(
    map(action => action.payload),
    switchMap(query => this.runQuery(query))
    );

  @Effect()
  refresh$: Observable<Action> = this.actions$
    .ofType<forecastsActions.Refresh>(forecastsActions.ForecastActionTypes.Refresh)
    .pipe(
    map(action => action.payload),
    switchMap(query => this.runQuery(query))
    );

  runQuery(query) {
    const nextLoad$ = this.actions$.ofType(forecastsActions.ForecastActionTypes.Load).pipe(skip(1));

    return this.weatherService
      .getWeather<WeatherForecast>()
      .pipe(
      takeUntil(nextLoad$),
      map((weatherForecast: WeatherForecast[]) => {
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
