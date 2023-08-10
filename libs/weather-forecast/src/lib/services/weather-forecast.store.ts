import { Injectable, computed, inject } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';

import { WeatherForecastState } from '../models/weather-forecast';
import { WeatherForecastService } from './weather-forecast.service';

@Injectable()
export class WeatherForecastStore
  extends ComponentStore<WeatherForecastState>
  implements OnStoreInit
{
  private weatherForecastService = inject(WeatherForecastService);

  readonly weatherForecasts = computed(() => this.state()?.weatherForecasts);
  readonly count = this.selectSignal((state) => state?.count);
  readonly loading = this.selectSignal((state) => state?.loading);

  ngrxOnStoreInit() {
    this.setState({
      weatherForecasts: null,
      error: null,
      count: null,
      loading: null,
    });
  }

  readonly getForecasts = this.effect((count$: Observable<number>) => {
    return count$.pipe(
      tap((count) => this.patchState({ count, loading: true })),
      switchMap((count) =>
        this.weatherForecastService.getForecasts(count).pipe(
          tapResponse({
            next: (weatherForecasts) =>
              this.patchState({ weatherForecasts, loading: false }),
            error: (error) => this.patchError(error, { error, loading: false }),
          }),
        ),
      ),
    );
  });

  private patchError(error: any, partialState: Partial<WeatherForecastState>) {
    console.error(error);
    this.patchState(partialState);
  }
}
