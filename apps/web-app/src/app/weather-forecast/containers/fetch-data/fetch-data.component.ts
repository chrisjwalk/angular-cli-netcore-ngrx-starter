import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PageContainerComponent } from '@myorg/common';
import { PageToolbarComponent } from '@myorg/common/page-toolbar';
import { PageToolbarButtonComponent } from '@myorg/common/page-toolbar-button';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as coreActions from '../../../core/store/actions';
import * as fromRoot from '../../../core/store/reducers';
import { WeatherForecast } from '../../../weather-forecast/models/weather-forecast';
import { WeatherForecastService } from '../../../weather-forecast/services/weather-forecast.service';
import { ForecastTableComponent } from '../../components/forecast-table/forecast-table.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PageContainerComponent,
    PageToolbarButtonComponent,
    MatFormFieldModule,
    MatInputModule,
    PageToolbarComponent,
    MatIconModule,
    ForecastTableComponent,
  ],
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
