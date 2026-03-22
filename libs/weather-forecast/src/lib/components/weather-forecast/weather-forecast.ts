import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { AuthStore } from '@myorg/auth';
import {
  LayoutStore,
  PageContainer,
  PageToolbar,
  PageToolbarButton,
} from '@myorg/shared';

import { WeatherForecastStore } from '../../state/weather-forecast.store';
import { ForecastTable } from '../forecast-table/forecast-table';

@Component({
  imports: [
    PageContainer,
    PageToolbarButton,
    MatFormField,
    MatLabel,
    MatInput,
    PageToolbar,
    MatIcon,
    ForecastTable,
  ],
  providers: [WeatherForecastStore],
  selector: 'lib-weather-forecast',
  template: `
    <lib-page-toolbar [title]="layoutStore.title()" />
    <lib-page-container>
      <div class="forecast-filter-bar mb-6 flex items-center gap-4">
        <mat-form-field appearance="outline">
          <mat-label>Forecast Days</mat-label>
          <input
            matInput
            #count
            type="number"
            [attr.aria-label]="'Number of forecast days'"
            (keyup.enter)="
              store.getForecasts({
                count: +count.value,
                plus: authStore.pageRequiresLogin(),
              })
            "
            [value]="store.count()"
          />
        </mat-form-field>
        <lib-page-toolbar-button
          (click)="
            store.getForecasts({
              count: +count.value,
              plus: authStore.pageRequiresLogin(),
            })
          "
          tooltip="Get Forecasts"
        >
          <mat-icon>refresh</mat-icon>
        </lib-page-toolbar-button>
      </div>
      <lib-forecast-table
        [loading]="store.weatherForecasts.isLoading()"
        [data]="store.filteredForecasts()"
      />
    </lib-page-container>
  `,
  host: {
    'data-testid': 'lib-weather-forecast',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherForecast {
  readonly layoutStore = inject(LayoutStore);
  readonly authStore = inject(AuthStore);
  readonly store = inject(WeatherForecastStore);

  constructor() {
    this.layoutStore.setTitle('Weather Forecasts');
  }
}
