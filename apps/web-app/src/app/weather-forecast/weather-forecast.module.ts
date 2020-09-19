import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared';
import { MaterialModule } from '../shared/material';
import { ForecastTableComponent } from './components/forecast-table/forecast-table.component';
import { FetchDataComponent } from './containers/fetch-data/fetch-data.component';
import { ForecastsGuard } from './guards/weather-forecast.guard';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    RouterModule.forChild([
      {
        path: '',
        component: FetchDataComponent,
        canActivate: [ForecastsGuard],
      },
    ]),
  ],
  declarations: [FetchDataComponent, ForecastTableComponent],
})
export class WeatherForecastModule {}
