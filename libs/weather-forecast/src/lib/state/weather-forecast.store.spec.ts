import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

import { WeatherForecastService } from '../services/weather-forecast.service';
import { weatherForecasts } from '../services/weather-forecast.service.spec';
import {
  WeatherForecastEntityStore,
  WeatherForecastStore,
} from './weather-forecast.store';

describe('WeatherForecastStore', () => {
  let service: WeatherForecastService;
  let store: WeatherForecastStore;
  let entityStore: WeatherForecastEntityStore;
  let appRef: ApplicationRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        WeatherForecastStore,
        WeatherForecastEntityStore,
        { provide: 'BASE_URL', useValue: '' },
      ],
    });

    store = TestBed.inject(WeatherForecastStore);
    entityStore = TestBed.inject(WeatherForecastEntityStore);
    service = TestBed.inject(WeatherForecastService);
    appRef = TestBed.inject(ApplicationRef);
  });

  it('WeatherForecastStore onInit hook should call getForecasts(10)', async () => {
    vi.spyOn(service, 'getForecasts').mockReturnValue(of(weatherForecasts));
    await appRef.whenStable();
    expect(store.count()).toBe(10);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBe(null);
  });

  describe('signal store rxResource tests', () => {
    it('WeatherForecastStore.getForecasts() should return data', async () => {
      vi.spyOn(service, 'getForecasts').mockReturnValue(
        of([weatherForecasts[0]]),
      );
      store.getForecasts({ count: 1, plus: false });

      await appRef.whenStable();
      expect(store.entities()).toEqual([weatherForecasts[0]]);
      expect(store.count()).toBe(1);
      expect(store.loading()).toBe(false);
    });

    it('WeatherForecastStore.getForecasts(count) should return data of length count', async () => {
      vi.spyOn(service, 'getForecasts').mockReturnValue(of(weatherForecasts));
      store.getForecasts({ count: 10, plus: false });

      await appRef.whenStable();
      expect(store.entities().length).toBe(10);
      expect(store.count()).toBe(10);
      expect(store.loading()).toBe(false);
    });

    it('WeatherForecastStore.getForecasts(count) should catch error', async () => {
      const error = { message: 'error' };
      vi.spyOn(service, 'getForecasts').mockImplementation(() =>
        throwError(() => error),
      );
      store.getForecasts({ count: 10, plus: false });

      await appRef.whenStable();
      expect(store.entities().length).toBe(0);
      expect(store.count()).toBe(10);
      expect(store.loading()).toBe(false);
      expect(store.error()).toBe(error);
    });
  });

  describe('signal store entities tests', () => {
    it('WeatherForecastStore.getForecasts() should return data', () => {
      vi.spyOn(service, 'getForecasts').mockReturnValue(
        of([weatherForecasts[0]]),
      );
      entityStore.getForecasts({ count: 1, plus: false });

      expect(entityStore.entities()).toEqual([weatherForecasts[0]]);
      expect(entityStore.count()).toBe(1);
      expect(entityStore.loading()).toBe(false);
    });

    it('WeatherForecastStore.getForecasts(count) should return data of length count', () => {
      vi.spyOn(service, 'getForecasts').mockReturnValue(of(weatherForecasts));
      entityStore.getForecasts({ count: 10, plus: false });
      expect(entityStore.entities().length).toBe(10);
      expect(entityStore.count()).toBe(10);
      expect(entityStore.loading()).toBe(false);
    });

    it('WeatherForecastStore.getForecasts(count) should catch error', () => {
      const error = { message: 'error' };
      vi.spyOn(service, 'getForecasts').mockImplementation(() =>
        throwError(() => error),
      );
      entityStore.getForecasts({ count: 10, plus: false });
      expect(entityStore.entities().length).toBe(0);
      expect(entityStore.count()).toBe(10);
      expect(entityStore.loading()).toBe(false);
      expect(entityStore.error()).toBe(error);
    });
  });
});
