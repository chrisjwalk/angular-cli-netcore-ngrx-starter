import { CommonModule } from '@angular/common';
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
import {
  LayoutStore,
  PageContainerComponent,
  PageToolbarButtonComponent,
  PageToolbarComponent,
} from '@myorg/shared';
import { getState } from '@ngrx/signals';

import { ForecastTableComponent } from '../forecast-table/forecast-table.component';
import { WeatherForecastStore } from '../../state/weather-forecast.store';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PageContainerComponent,
    PageToolbarButtonComponent,
    MatFormFieldModule,
    MatInputModule,
    PageToolbarComponent,
    MatIconModule,
    ForecastTableComponent,
  ],
  selector: 'lib-weather-forecast',
  template: `
    <ng-container *ngIf="vm() as vm">
      <lib-page-toolbar [title]="vm.title">
        <mat-form-field appearance="outline">
          <input
            matInput
            #count
            type="number"
            placeholder="Forecast Days"
            (keyup.enter)="weatherForecastStore.getForecasts(+count.value)"
            [value]="vm.count"
          />
        </mat-form-field>
        <lib-page-toolbar-button
          (click)="weatherForecastStore.getForecasts(+count.value)"
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
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherForecastComponent implements OnInit {
  layoutStore = inject(LayoutStore);
  weatherForecastStore = inject(WeatherForecastStore);

  vm = computed(() => ({
    ...getState(this.layoutStore),
    ...getState(this.weatherForecastStore),
    weatherForecasts: this.weatherForecastStore.entities(),
  }));

  @HostBinding('attr.data-testid') get testId() {
    return 'lib-weather-forecast';
  }

  ngOnInit() {
    this.layoutStore.setTitle('Weather Forecasts');
  }
}
