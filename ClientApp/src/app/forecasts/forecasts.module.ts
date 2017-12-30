import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from 'app/shared';
import { MaterialModule } from 'app/shared/material';

import { effects } from 'app/forecasts/store/effects';
import { reducers } from 'app/forecasts/store/reducers';
import { ForecastsGuard } from 'app/forecasts/guards/forecasts.guard';
import { ForecastsService } from 'app/forecasts/services/forecasts.service';

import { FetchDataComponent } from 'app/forecasts/containers/fetch-data/fetch-data.component';
import { ForecastTableComponent } from 'app/forecasts/components/forecast-table/forecast-table.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    RouterModule.forChild([
      { path: '', component: FetchDataComponent, canActivate: [ForecastsGuard] },
    ]),
    StoreModule.forFeature('forecasts', reducers),
    EffectsModule.forFeature(effects),
  ],
  declarations: [
    FetchDataComponent,
    ForecastTableComponent
  ],
  providers: [ForecastsGuard, ForecastsService],
})
export class ForecastsModule {}
