import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ForecastTableComponent } from 'app/weather-forecast/components/forecast-table/forecast-table.component';
import { FetchDataComponent } from 'app/weather-forecast/containers/fetch-data/fetch-data.component';
import { ForecastsGuard } from 'app/weather-forecast/guards/weather-forecast.guard';
import { SharedModule } from 'app/shared';
import { MaterialModule } from 'app/shared/material';

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
