import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
  inject,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  LayoutStore,
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
  layoutService = inject(LayoutStore);
  weatherForecastStore = inject(WeatherForecastStore);

  @HostBinding('attr.data-testid') get testId() {
    return 'lib-weather-forecast';
  }

  ngOnInit() {
    this.layoutService.setTitle('Weather Forecasts');
  }

  getForecasts(count: number) {
    this.weatherForecastStore.getForecasts(count);
  }
}
