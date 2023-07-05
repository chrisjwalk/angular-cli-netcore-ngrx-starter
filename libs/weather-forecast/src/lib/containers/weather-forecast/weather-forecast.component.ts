import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  LayoutService,
  PageContainerComponent,
  PageToolbarButtonComponent,
  PageToolbarComponent,
} from '@myorg/shared';

import { ForecastTableComponent } from '../../components/forecast-table/forecast-table.component';
import { WeatherForecastStore } from '../../services/weather-forecast.store';

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
  selector: 'lib-weather-forecast',
  templateUrl: './weather-forecast.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherForecastComponent implements OnInit {
  @HostBinding('attr.data-testid') get testId() {
    return 'lib-weather-forecast';
  }

  constructor(
    public layoutService: LayoutService,
    public weatherForecastStore: WeatherForecastStore,
  ) {}

  ngOnInit() {
    this.layoutService.setTitle('Weather Forecasts');
  }

  getForecasts(count: number) {
    this.weatherForecastStore.getForecasts(count);
  }
}
