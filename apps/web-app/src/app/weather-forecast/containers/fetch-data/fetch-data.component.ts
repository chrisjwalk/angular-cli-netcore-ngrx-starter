import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as coreActions from '../../../core/store/actions';
import * as fromRoot from '../../../core/store/reducers';
import { SharedModule } from '../../../shared';
import { MaterialModule } from '../../../shared/material';
import { WeatherForecast } from '../../../weather-forecast/models/weather-forecast';
import { WeatherForecastService } from '../../../weather-forecast/services/weather-forecast.service';
import { ForecastTableComponent } from '../../components/forecast-table/forecast-table.component';

@Component({
  standalone: true,
  imports: [CommonModule, SharedModule, MaterialModule, ForecastTableComponent],
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
    private weatherForecastService: WeatherForecastService,
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
