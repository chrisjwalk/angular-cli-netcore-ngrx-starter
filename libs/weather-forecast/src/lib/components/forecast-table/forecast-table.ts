import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { patchState, signalState } from '@ngrx/signals';
import { BreakpointStore } from '@myorg/shared';
import { HlmButton } from '@myorg/spartan';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, LucideAngularModule } from 'lucide-angular';
import { WeatherForecast } from '../../models/weather-forecast';

@Component({
  imports: [HlmButton, LucideAngularModule],
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
        class="flex flex-col flex-1 overflow-hidden rounded-2xl bg-surface-container-low shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_24px_48px_rgba(0,0,0,0.4)]"
      >
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-surface-container">
                @for (col of displayColumnDetails(); track col.name) {
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wide"
                  >
                    {{ col.label }}
                  </th>
                }
              </tr>
            </thead>
            <tbody>
              @for (row of pagedData(); track $index) {
                <tr
                  class="hover:bg-surface-container-high transition-colors"
                  data-testid="table-row"
                >
                  @for (col of displayedColumns(); track col) {
                    <td class="px-4 py-3.5 text-sm text-on-surface">
                      {{ cellValue(row, col) }}
                    </td>
                  }
                </tr>
              } @empty {
                <tr>
                  <td
                    [attr.colspan]="displayedColumns().length"
                    class="px-4 py-12 text-center text-on-surface-variant"
                  >
                    No forecasts available.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <!-- Paginator -->
        <div
          class="flex items-center justify-between px-4 py-2.5 bg-surface-container-low"
        >
          <div class="flex items-center gap-3">
            <span class="text-xs text-on-surface-variant">
              {{ firstItem() }}-{{ lastItem() }} of {{ data().length }}
            </span>
            <select
              class="text-xs bg-transparent border border-outline-variant rounded px-1.5 py-0.5 text-on-surface-variant cursor-pointer"
              [value]="pageSize()"
              (change)="setPageSize(+$any($event.target).value)"
              aria-label="Items per page"
            >
              <option [value]="5">5</option>
              <option [value]="10">10</option>
              <option [value]="25">25</option>
            </select>
          </div>
          <div class="flex items-center gap-1">
            <button
              hlmButton
              variant="ghost"
              size="icon"
              [disabled]="currentPage() === 0"
              (click)="goToPage(0)"
              aria-label="First page"
            >
              <lucide-icon [name]="chevronsLeftIcon" class="h-4 w-4" />
            </button>
            <button
              hlmButton
              variant="ghost"
              size="icon"
              [disabled]="currentPage() === 0"
              (click)="goToPage(currentPage() - 1)"
              aria-label="Previous page"
            >
              <lucide-icon [name]="chevronLeftIcon" class="h-4 w-4" />
            </button>
            <span class="text-xs text-on-surface-variant px-2 min-w-[60px] text-center">
              {{ currentPage() + 1 }} / {{ totalPages() || 1 }}
            </span>
            <button
              hlmButton
              variant="ghost"
              size="icon"
              [disabled]="currentPage() >= totalPages() - 1"
              (click)="goToPage(currentPage() + 1)"
              aria-label="Next page"
            >
              <lucide-icon [name]="chevronRightIcon" class="h-4 w-4" />
            </button>
            <button
              hlmButton
              variant="ghost"
              size="icon"
              [disabled]="currentPage() >= totalPages() - 1"
              (click)="goToPage(totalPages() - 1)"
              aria-label="Last page"
            >
              <lucide-icon [name]="chevronsRightIcon" class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    }
  `,
  host: {
    class: 'flex flex-col',
    'data-testid': 'lib-forecast-table',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BreakpointStore],
})
export class ForecastTable {
  readonly breakpointStore = inject(BreakpointStore);

  readonly chevronsLeftIcon = ChevronsLeft;
  readonly chevronLeftIcon = ChevronLeft;
  readonly chevronRightIcon = ChevronRight;
  readonly chevronsRightIcon = ChevronsRight;

  loading = input<boolean>(null);
  data = input<WeatherForecast[]>([]);

  readonly currentPage = signal(0);
  readonly pageSize = signal(5);

  readonly state = signalState({
    columns: [
      { name: 'dateFormatted', label: 'Date', visible: true, displayHandsetPortrait: true },
      { name: 'temperatureC', label: 'Temp. (C)', visible: true, displayHandsetPortrait: false },
      { name: 'temperatureF', label: 'Temp. (F)', visible: true, displayHandsetPortrait: true },
      { name: 'summary', label: 'Summary', visible: true, displayHandsetPortrait: false },
    ],
  });

  readonly displayedColumns = computed(() =>
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

  readonly displayColumnDetails = computed(() =>
    this.state.columns().filter(
      (c) =>
        c.visible &&
        (this.breakpointStore.handsetPortrait()
          ? c.displayHandsetPortrait
          : true),
    ),
  );

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.data().length / this.pageSize())),
  );

  readonly pagedData = computed(() => {
    const start = this.currentPage() * this.pageSize();
    const validPage = Math.min(this.currentPage(), this.totalPages() - 1);
    if (validPage !== this.currentPage()) {
      this.currentPage.set(validPage);
      return this.data().slice(0, this.pageSize());
    }
    return this.data().slice(start, start + this.pageSize());
  });

  readonly firstItem = computed(() =>
    this.data().length === 0 ? 0 : this.currentPage() * this.pageSize() + 1,
  );

  readonly lastItem = computed(() => {
    const end = (this.currentPage() + 1) * this.pageSize();
    return Math.min(end, this.data().length);
  });

  cellValue(row: WeatherForecast, col: string): string | number {
    return (row as Record<string, unknown>)[col] as string | number;
  }

  toggleColumnVisible(name: string): void {
    patchState(this.state, {
      columns: this.state
        .columns()
        .map((c) => (c.name === name ? { ...c, visible: !c.visible } : c)),
    });
  }

  toggleSummary(): void {
    this.toggleColumnVisible('summary');
  }

  goToPage(page: number): void {
    this.currentPage.set(Math.max(0, Math.min(page, this.totalPages() - 1)));
  }

  setPageSize(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(0);
  }
}
