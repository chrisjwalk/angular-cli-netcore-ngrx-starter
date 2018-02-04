import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { Store, select } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { tap, filter, take, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import * as fromForecasts from 'app/forecasts/store/reducers';
import * as forecastsActions from 'app/forecasts/store/actions';

@Injectable()
export class ForecastsGuard implements CanActivate {
  constructor(private store: Store<fromForecasts.State>) { }

  getFromStoreOrAPI(): Observable<any> {
    return this.store
      .pipe(
        select(fromForecasts.getForecasts),
        tap((data) => {
          if (!data.length) {
            this.store.dispatch(new forecastsActions.Load());
          }
        }),
        filter((data) => data.length > 0),
        take(1)
    );
  }

  canActivate(): Observable<boolean> {
    return this.getFromStoreOrAPI().pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }
}
