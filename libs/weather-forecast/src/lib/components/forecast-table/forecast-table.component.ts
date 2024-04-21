import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
  LayoutModule,
} from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
  computed,
  inject,
  input,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { patchState, signalState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { map, pipe } from 'rxjs';

import { WeatherForecast } from '../../models/weather-forecast';

@Component({
  standalone: true,
  imports: [MatTableModule, MatProgressSpinnerModule, LayoutModule],
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
      <!-- @if (!state.handsetPortrait()) {
        <div class="flex justify-end">
          <button
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
            (click)="toggleSummary()"
          >
            Toggle Summary
          </button>
        </div>
      } -->
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForecastTableComponent implements OnInit {
  breakpointObserver = inject(BreakpointObserver);
  @HostBinding('attr.data-testid') testid = 'lib-forecast-table';

  loading = input<boolean>(null);
  data = input<WeatherForecast[]>(null);

  ngOnInit() {
    this.rxBreakpointObserver(
      this.breakpointObserver.observe(Breakpoints.HandsetPortrait),
    );
  }

  rxBreakpointObserver = rxMethod<BreakpointState>(
    pipe(
      map((result) =>
        patchState(this.state, { handsetPortrait: result.matches }),
      ),
    ),
  );

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
    handsetPortrait: false,
  });

  displayedColumns = computed(() =>
    this.state
      .columns()
      .filter(
        (c) =>
          c.visible &&
          (this.state.handsetPortrait() ? c.displayHandsetPortrait : true),
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
