import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { WeatherForecast } from '../../models/weather-forecast';

@Component({
  standalone: true,
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule],
  selector: 'lib-forecast-table',
  templateUrl: './forecast-table.component.html',
  styleUrls: ['./forecast-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForecastTableComponent {
  @HostBinding('attr.data-testid') get testId() {
    return 'lib-forecast-table';
  }

  @Input() loading: boolean;
  @Input() set data(data: WeatherForecast[]) {
    this.dataSource.data = data;
  }

  dataSource = new MatTableDataSource<WeatherForecast>([]);
  displayedColumns = [
    'dateFormatted',
    'temperatureC',
    'temperatureF',
    'summary',
  ];
}
