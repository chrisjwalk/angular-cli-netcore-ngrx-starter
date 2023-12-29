import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthStore } from '@myorg/auth';
import {
  LayoutStore,
  PageContainerComponent,
  PageToolbarButtonComponent,
  PageToolbarComponent,
} from '@myorg/shared';
import { getState } from '@ngrx/signals';

import { WeatherForecastStore } from '../../state/weather-forecast.store';
import { ForecastTableComponent } from '../forecast-table/forecast-table.component';

@Component({
  standalone: true,
  imports: [
    PageContainerComponent,
    PageToolbarButtonComponent,
    MatFormFieldModule,
    MatInputModule,
    PageToolbarComponent,
    MatIconModule,
    ForecastTableComponent,
  ],
  providers: [WeatherForecastStore],
  selector: 'lib-weather-forecast',
  template: `
    @if (vm(); as vm) {
      <lib-page-toolbar [title]="vm.title">
        <mat-form-field appearance="outline">
          <input
            matInput
            #count
            type="number"
            placeholder="Forecast Days"
            (keyup.enter)="
              store.getForecasts({ count: +count.value, plus: vm.plus })
            "
            [value]="vm.count"
          />
        </mat-form-field>
        <lib-page-toolbar-button
          (click)="store.getForecasts({ count: +count.value, plus: vm.plus })"
          tooltip="Get Forecasts"
        >
          <mat-icon>refresh</mat-icon>
        </lib-page-toolbar-button>
      </lib-page-toolbar>
      <lib-page-container>
        <lib-forecast-table
          [loading]="vm.loading"
          [data]="vm.weatherForecasts"
        />
      </lib-page-container>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherForecastComponent implements OnInit {
  private readonly layoutStore = inject(LayoutStore);
  private readonly authStore = inject(AuthStore);

  readonly store = inject(WeatherForecastStore);
  readonly vm = computed(() => ({
    ...getState(this.layoutStore),
    ...getState(this.store),
    plus: this.authStore.pageRequiresLogin(),
    weatherForecasts: this.store.entities(),
  }));

  @HostBinding('attr.data-testid') testid = 'lib-weather-forecast';

  ngOnInit() {
    this.layoutStore.setTitle('Weather Forecasts');
  }
}
