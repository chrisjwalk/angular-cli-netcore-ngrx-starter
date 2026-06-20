import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthStore } from '@myorg/auth';
import {
  BreakpointStore,
  LayoutStore,
  PageContainer,
  PageToolbar,
} from '@myorg/shared';
import { HlmButton, HlmField, HlmInput, HlmLabel } from '@myorg/spartan';
import { RefreshCw, LucideAngularModule } from 'lucide-angular';

import { WeatherForecastStore } from '../../state/weather-forecast.store';
import { ForecastTable } from '../forecast-table/forecast-table';

@Component({
  imports: [
    PageContainer,
    HlmButton,
    HlmField,
    HlmLabel,
    HlmInput,
    PageToolbar,
    LucideAngularModule,
    ForecastTable,
  ],
  providers: [WeatherForecastStore, BreakpointStore],
  selector: 'lib-weather-forecast',
  template: `
    <lib-page-toolbar [title]="layoutStore.title()" />
    <lib-page-container class="flex-1">
      <div
        class="forecast-filter-bar mb-6 flex flex-wrap items-center gap-4 rounded-2xl bg-surface-container p-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
      >
        <div class="flex items-center gap-3">
          <hlm-field>
            <label hlmLabel for="forecast-days">Forecast Days</label>
            <input
              hlmInput
              id="forecast-days"
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
          </hlm-field>
          @if (breakpointStore.handset()) {
            <button
              hlmButton
              variant="default"
              size="icon"
              (click)="
                store.getForecasts({
                  count: +count.value,
                  plus: authStore.pageRequiresLogin(),
                })
              "
              aria-label="Get Forecasts"
            >
              <lucide-icon [name]="refreshIcon" class="h-4 w-4" />
            </button>
          } @else {
            <button
              hlmButton
              variant="default"
              (click)="
                store.getForecasts({
                  count: +count.value,
                  plus: authStore.pageRequiresLogin(),
                })
              "
              aria-label="Fetch weather forecasts"
            >
              <lucide-icon [name]="refreshIcon" class="h-4 w-4" />
              Get Forecasts
            </button>
          }
        </div>
      </div>
      <lib-forecast-table
        class="flex-1"
        [loading]="store.weatherForecasts.isLoading()"
        [data]="store.filteredForecasts()"
      />
    </lib-page-container>
  `,
  host: {
    'data-testid': 'lib-weather-forecast',
    class: 'flex flex-col min-h-full',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherForecast {
  readonly layoutStore = inject(LayoutStore);
  readonly authStore = inject(AuthStore);
  readonly store = inject(WeatherForecastStore);
  readonly breakpointStore = inject(BreakpointStore);
  readonly refreshIcon = RefreshCw;

  constructor() {
    this.layoutStore.setTitle('Weather Forecasts');
  }
}
