import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { AuthStore } from '@myorg/auth';
import { LayoutStore, PageContainer, PageToolbar } from '@myorg/shared';

import { WeatherForecastStore } from '../../state/weather-forecast.store';
import { ForecastTable } from '../forecast-table/forecast-table';

@Component({
  imports: [
    PageContainer,
    MatButton,
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
      <div
        class="forecast-filter-bar mb-6 flex flex-wrap items-center gap-4 rounded-2xl bg-surface-container p-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
      >
        <div class="flex items-center gap-3">
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
          <button
            mat-flat-button
            class="!px-3 sm:!px-4"
            color="primary"
            (click)="
              store.getForecasts({
                count: +count.value,
                plus: authStore.pageRequiresLogin(),
              })
            "
            aria-label="Get Forecasts"
          >
            <mat-icon class="sm:!mr-2 !mr-0">refresh</mat-icon>
            <span class="hidden sm:inline">Get Forecasts</span>
          </button>
        </div>
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
