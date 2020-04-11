import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { WeatherForecast } from 'app/forecasts/models/weather-forecast';

@Component({
  selector: 'app-forecast-table',
  templateUrl: './forecast-table.component.html',
  styleUrls: ['./forecast-table.component.scss'],
})
export class ForecastTableComponent implements OnInit {
  @Input() loading: boolean;
  @Input() dataSource: MatTableDataSource<WeatherForecast>;

  displayedColumns = [];

  constructor() {}

  ngOnInit() {
    this.displayedColumns = [
      'dateFormatted',
      'temperatureC',
      'temperatureF',
      'summary',
    ];
  }
}
