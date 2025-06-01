import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import {
  MatCell,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatCellDef,
  MatHeaderCellDef,
  MatColumnDef,
} from '@angular/material/table';
import { patchState, signalState } from '@ngrx/signals';

import { BreakpointStore } from '@myorg/shared';
import { WeatherForecast } from '../../models/weather-forecast';

@Component({
  imports: [
    MatTable,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatHeaderRowDef,
    MatCellDef,
    MatHeaderCellDef,
    MatColumnDef,
  ],
  selector: 'lib-forecast-table',
  template: `
    @if (loading()) {
      <div class="flex flex-col gap-4">
        <div class="loading h-12 bg-neutral-300 dark:bg-neutral-700"></div>
        <div class="loading h-96 bg-neutral-300 dark:bg-neutral-700"></div>
      </div>
    } @else {
      <div class="mat-elevation-z2">
        <mat-table #table [dataSource]="data()">
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
          <mat-header-row
            *matHeaderRowDef="displayedColumns()"
          ></mat-header-row>
          <mat-row
            *matRowDef="let row; columns: displayedColumns()"
            data-testid="table-row"
          ></mat-row>
        </mat-table>
      </div>
    }
  `,
  host: {
    'data-testid': 'lib-forecast-table',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BreakpointStore],
})
export class ForecastTable {
  breakpointStore = inject(BreakpointStore);

  loading = input<boolean>(null);
  data = input<WeatherForecast[]>(null);

  state = signalState({
    columns: [
      { name: 'dateFormatted', visible: true, displayHandsetPortrait: true },
      {
        name: 'temperatureC',
        visible: true,
        displayHandsetPortrait: false,
      },
      {
        name: 'temperatureF',
        visible: true,
        displayHandsetPortrait: true,
      },
      { name: 'summary', visible: true, displayHandsetPortrait: false },
    ],
  });

  displayedColumns = computed(() =>
    this.state
      .columns()
      .filter(
        (c) =>
          c.visible &&
          (this.breakpointStore.handsetPortrait()
            ? c.displayHandsetPortrait
            : true),
      )
      .map((c) => c.name),
  );

  toggleColumnVisible(name: string) {
    patchState(this.state, {
      columns: this.state
        .columns()
        .map((c) => (c.name === name ? { ...c, visible: !c.visible } : c)),
    });
  }

  toggleSummary() {
    this.toggleColumnVisible('summary');
  }
}
