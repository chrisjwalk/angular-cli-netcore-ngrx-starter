import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
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
    <lib-page-toolbar [title]="layoutStore.title()">
      <mat-form-field appearance="outline">
        <input
          matInput
          #count
          type="number"
          placeholder="Forecast Days"
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
    </lib-page-toolbar>
    <lib-page-container>
      <lib-forecast-table
        [loading]="store.loading()"
        [data]="store.entities()"
      />
    </lib-page-container>
  `,
  host: {
    'data-testid': 'lib-weather-forecast',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherForecastComponent implements OnInit {
  readonly layoutStore = inject(LayoutStore);
  readonly authStore = inject(AuthStore);
  readonly store = inject(WeatherForecastStore);

  ngOnInit() {
    this.layoutStore.setTitle('Weather Forecasts');
  }
}
