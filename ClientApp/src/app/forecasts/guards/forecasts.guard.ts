import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';

import * as forecastsActions from 'app/forecasts/store/actions';
import * as fromForecasts from 'app/forecasts/store/reducers';

@Injectable({
  providedIn: 'root',
})
export class ForecastsGuard implements CanActivate {
  constructor(private store: Store<fromForecasts.State>) {}

  getFromStoreOrAPI(): Observable<any> {
    return this.store.pipe(
      select(fromForecasts.getForecasts),
      tap((data) => {
        if (!data.length) {
          this.store.dispatch(forecastsActions.load({ count: 10 }));
        }
      }),
      filter((data) => data.length > 0),
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
