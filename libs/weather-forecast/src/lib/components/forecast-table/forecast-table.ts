import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  viewChild,
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
  MatTableDataSource,
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { patchState, signalMethod, signalState } from '@ngrx/signals';

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
    MatPaginator,
  ],
  selector: 'lib-forecast-table',
  template: `
    @if (loading()) {
      <div class="flex flex-col gap-4">
        <div
          class="loading h-12 bg-surface-container-low dark:bg-surface-container-high"
        ></div>
        <div
          class="loading h-96 bg-surface-container-low dark:bg-surface-container-high"
        ></div>
      </div>
    } @else {
      <div
        class="overflow-hidden rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_24px_48px_rgba(0,0,0,0.4)]"
      >
        <mat-table #table [dataSource]="dataSource">
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
        <mat-paginator
          [pageSizeOptions]="[5, 10, 25]"
          [pageSize]="10"
          showFirstLastButtons
          aria-label="Select page of forecasts"
        ></mat-paginator>
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

  readonly dataSource = new MatTableDataSource<WeatherForecast>([]);
  readonly paginator = viewChild(MatPaginator);

  private readonly syncData = signalMethod<WeatherForecast[]>((data) => {
    this.dataSource.data = data ?? [];
  });

  // signalMethod reacts whenever this.paginator() changes — correctly
  // connects the paginator after the @if(loading()) branch resolves.
  private readonly connectPaginator = signalMethod<MatPaginator | undefined>(
    (paginator) => {
      this.dataSource.paginator = paginator ?? null;
    },
  );

  constructor() {
    this.syncData(this.data);
    this.connectPaginator(this.paginator);
  }

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
