import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
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
  });

  it('WeatherForecastStore onInit hook should call getForecasts(10)', () => {
    expect(store.count()).toBe(10);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBe(null);
  });

  describe('signal store rxResource tests', () => {
    xit('WeatherForecastStore.getForecasts() should return data', fakeAsync(() => {
      jest
        .spyOn(service, 'getForecasts')
        .mockReturnValue(of([weatherForecasts[0]]));
      store.getForecasts({ count: 1, plus: false });

      tick(2000);
      expect(store.entities()).toEqual([weatherForecasts[0]]);
      expect(store.count()).toBe(1);
      expect(store.loading()).toBe(false);
    }));
  });

  describe('signal store entities tests', () => {
    it('WeatherForecastStore.getForecasts() should return data', () => {
      jest
        .spyOn(service, 'getForecasts')
        .mockReturnValue(of([weatherForecasts[0]]));
      entityStore.getForecasts({ count: 1, plus: false });

      expect(entityStore.entities()).toEqual([weatherForecasts[0]]);
      expect(entityStore.count()).toBe(1);
      expect(entityStore.loading()).toBe(false);
    });

    it('WeatherForecastStore.getForecasts(count) should return data of length count', () => {
      jest.spyOn(service, 'getForecasts').mockReturnValue(of(weatherForecasts));
      entityStore.getForecasts({ count: 10, plus: false });
      expect(entityStore.entities().length).toBe(10);
      expect(entityStore.count()).toBe(10);
      expect(entityStore.loading()).toBe(false);
    });

    it('WeatherForecastStore.getForecasts(count) should catch error', () => {
      const error = { message: 'error' };
      jest
        .spyOn(service, 'getForecasts')
        .mockImplementation(() => throwError(() => error));
      entityStore.getForecasts({ count: 10, plus: false });
      expect(entityStore.entities().length).toBe(0);
      expect(entityStore.count()).toBe(10);
      expect(entityStore.loading()).toBe(false);
      expect(entityStore.error()).toBe(error);
    });
  });
});
