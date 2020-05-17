import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as coreActions from 'app/core/store/actions';
import * as fromRoot from 'app/core/store/reducers';
import { WeatherForecast } from 'app/weather-forecast/models/weather-forecast';
import { WeatherForecastService } from 'app/weather-forecast/services/weather-forecast.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-fetch-data',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fetch-data.component.html',
})
export class FetchDataComponent implements OnInit {
  weatherForecasts$: Observable<WeatherForecast[]>;
  count$: Observable<number>;
  loading$: Observable<boolean>;
  error$: Observable<HttpErrorResponse | any>;
  title$: Observable<string>;
  constructor(
    private store: Store<fromRoot.State>,
    private weatherForecastService: WeatherForecastService
  ) {}

  ngOnInit() {
    this.store.dispatch(coreActions.setTitle({ title: 'Weather Forecasts' }));
    this.title$ = this.store.pipe(select(fromRoot.getTitle));
    this.weatherForecasts$ = this.weatherForecastService.entities$;
    this.count$ = this.weatherForecastService.count$;
    this.loading$ = this.weatherForecastService.loading$;
    this.error$ = this.weatherForecastService.errors$;
  }

  getForecasts(count: number) {
    this.weatherForecastService.refresh(count);
  }
}
