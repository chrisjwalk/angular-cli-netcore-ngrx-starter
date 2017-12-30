import { Component, Input, Output, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { WeatherForecast } from '../../models/weather-forecast';

@Component({
  selector: 'app-forecast-table',
  templateUrl: './forecast-table.component.html',
  styleUrls: ['./forecast-table.component.scss']
})
export class ForecastTableComponent implements OnInit {
  @Input() loading: boolean;
  // @Input() forecasts: WeatherForecast[];
  displayedColumns = [];
  @Input() dataSource: MatTableDataSource<WeatherForecast>;

  constructor() { }

  ngOnInit() {
    this.displayedColumns = ['dateFormatted', 'temperatureC', 'temperatureF', 'summary'];

  }

}
