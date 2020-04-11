import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ForecastTableComponent } from 'app/forecasts/components/forecast-table/forecast-table.component';
import { FetchDataComponent } from 'app/forecasts/containers/fetch-data/fetch-data.component';
import { ForecastsGuard } from 'app/forecasts/guards/forecasts.guard';
import { effects } from 'app/forecasts/store/effects';
import { reducers } from 'app/forecasts/store/reducers';
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
    StoreModule.forFeature('forecasts', reducers),
    EffectsModule.forFeature(effects),
  ],
  declarations: [FetchDataComponent, ForecastTableComponent],
})
export class ForecastsModule {}
