import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as coreActions from 'app/core/store/actions';
import * as fromRoot from 'app/core/store/reducers';
import { WeatherForecast } from 'app/forecasts/models/weather-forecast';
import * as forecastsActions from 'app/forecasts/store/actions';
import * as fromForecasts from 'app/forecasts/store/reducers';

@Component({
  selector: 'app-fetch-data',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fetch-data.component.html',
})
export class FetchDataComponent implements OnInit, OnDestroy {
  forecasts$: Observable<WeatherForecast[]>;
  count$: Observable<number>;
  loading$: Observable<boolean>;
  error$: Observable<HttpErrorResponse | any>;
  title$: Observable<string>;
  dataSource: MatTableDataSource<WeatherForecast>;

  private ngUnsubscribe: Subject<boolean> = new Subject();

  constructor(private store: Store<fromForecasts.State>) {
    this.store.dispatch(new coreActions.SetTitle('Weather Forecasts'));
    this.title$ = this.store.pipe(select(fromRoot.getTitle));
    this.forecasts$ = this.store.pipe(select(fromForecasts.getForecasts));
    this.count$ = this.store.pipe(select(fromForecasts.getCount));
    this.loading$ = this.store.pipe(select(fromForecasts.getLoading));
    this.error$ = this.store.pipe(select(fromForecasts.getError));
    this.dataSource = new MatTableDataSource<WeatherForecast>([]);
    this.forecasts$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => (this.dataSource.data = data));
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

  getForecasts(count: number) {
    this.store.dispatch(new forecastsActions.Refresh(count));
  }
}
