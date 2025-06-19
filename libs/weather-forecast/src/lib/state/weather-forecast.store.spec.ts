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
    expect(store.weatherForecasts.isLoading()).toBe(false);
    expect(store.weatherForecasts.error()).toBeFalsy();
  });

  describe('signal store rxResource tests', () => {
    it('WeatherForecastStore.getForecasts() should return data', async () => {
      vi.spyOn(service, 'getForecasts').mockReturnValue(
        of([weatherForecasts[0]]),
      );
      store.getForecasts({ count: 1, plus: false });

      await appRef.whenStable();
      expect(store.weatherForecasts.value()).toEqual([weatherForecasts[0]]);
      expect(store.count()).toBe(1);
      expect(store.weatherForecasts.isLoading()).toBe(false);
    });

    it('WeatherForecastStore.getForecasts(count) should return data of length count', async () => {
      vi.spyOn(service, 'getForecasts').mockReturnValue(of(weatherForecasts));
      store.getForecasts({ count: 10, plus: false });

      await appRef.whenStable();
      expect(store.weatherForecasts.value().length).toBe(10);
      expect(store.count()).toBe(10);
      expect(store.weatherForecasts.isLoading()).toBe(false);
    });

    it('WeatherForecastStore.getForecasts(count) should catch error', async () => {
      const error = new Error('error');
      vi.spyOn(service, 'getForecasts').mockImplementation(() =>
        throwError(() => error),
      );
      store.getForecasts({ count: 10, plus: false });

      await appRef.whenStable();
      expect(store.count()).toBe(10);
      expect(store.weatherForecasts.isLoading()).toBe(false);
      expect(store.weatherForecasts.error()).toBe(error);
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

  describe('weather forecast filtering', () => {
    it('should filter forecasts by temperature range', async () => {
      vi.spyOn(service, 'getForecasts').mockReturnValue(of(weatherForecasts));
      store.getForecasts({ count: weatherForecasts.length, plus: false });

      await appRef.whenStable();

      // Initial state should show all forecasts
      expect(store.weatherForecasts.value().length).toBe(
        weatherForecasts.length,
      );

      // Filter to only show forecasts with temperature >= 0
      store.setFilter({ minTemperatureC: 0, maxTemperatureC: 100 });
      const filteredMin = store.filteredForecasts();
      console.log('Filtered forecasts (minTemperatureC >= 0):', filteredMin);
      expect(filteredMin.every((f) => f.temperatureC >= 0)).toBe(true);

      // Add max temperature filter <= 30
      store.setFilter({ minTemperatureC: 0, maxTemperatureC: 30 });
      const filtered = store.filteredForecasts();
      expect(
        filtered.every((f) => f.temperatureC >= 0 && f.temperatureC <= 30),
      ).toBe(true);

      // Reset filters should show all forecasts again
      store.setFilter({ minTemperatureC: -100, maxTemperatureC: 100 });
      expect(store.filteredForecasts().length).toBe(weatherForecasts.length);
    });

    it('should handle empty forecast list', async () => {
      vi.spyOn(service, 'getForecasts').mockReturnValue(of([]));
      store.getForecasts({ count: 0, plus: false });

      await appRef.whenStable();

      store.setFilter({ minTemperatureC: 0, maxTemperatureC: 30 });
      expect(store.filteredForecasts().length).toBe(0);
    });
  });
});
