import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

import { WeatherForecast } from '../../models/weather-forecast';

@Component({
  standalone: true,
  imports: [MatTableModule, MatProgressSpinnerModule],
  selector: 'lib-forecast-table',
  template: `
    @if (loading) {
      <div class="flex flex-col gap-4">
        <div class="loading h-12 bg-neutral-300 dark:bg-neutral-700"></div>
        <div class="loading h-96 bg-neutral-300 dark:bg-neutral-700"></div>
      </div>
    } @else {
      <div class="mat-elevation-z2">
        <mat-table #table [dataSource]="data">
          <ng-container matColumnDef="dateFormatted">
            <mat-header-cell *matHeaderCellDef> Date </mat-header-cell>
            <mat-cell *matCellDef="let forecast">
              {{ forecast.dateFormatted }}
            </mat-cell>
          </ng-container>
          <ng-container matColumnDef="temperatureC">
            <mat-header-cell *matHeaderCellDef> Temp. (C) </mat-header-cell>
            <mat-cell *matCellDef="let forecast">
              {{ forecast.temperatureC }}
            </mat-cell>
          </ng-container>
          <ng-container matColumnDef="temperatureF">
            <mat-header-cell *matHeaderCellDef> Temp. (F) </mat-header-cell>
            <mat-cell *matCellDef="let forecast">
              {{ forecast.temperatureF }}
            </mat-cell>
          </ng-container>
          <ng-container matColumnDef="summary">
            <mat-header-cell *matHeaderCellDef> Summary </mat-header-cell>
            <mat-cell *matCellDef="let forecast">
              {{ forecast.summary }}
            </mat-cell>
          </ng-container>
          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row
            *matRowDef="let row; columns: displayedColumns"
            data-testid="table-row"
          ></mat-row>
        </mat-table>
      </div>
    }
  `,
  styles: [
    `
      .loading {
        animation: loading 1s linear infinite alternate;
      }

      @keyframes loading {
        0% {
          opacity: 0.6;
        }
        50% {
          opacity: 1;
        }
        100% {
          opacity: 0.6;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForecastTableComponent {
  @HostBinding('attr.data-testid') testid = 'lib-forecast-table';

  @Input() loading: boolean;
  @Input() data: WeatherForecast[];

  displayedColumns = [
    'dateFormatted',
    'temperatureC',
    'temperatureF',
    'summary',
  ];
}
