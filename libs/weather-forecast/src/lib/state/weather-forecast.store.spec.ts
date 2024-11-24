import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

import { WeatherForecastService } from '../services/weather-forecast.service';
import { weatherForecasts } from '../services/weather-forecast.service.spec';
import { WeatherForecastStore } from './weather-forecast.store';

describe('WeatherForecastStore', () => {
  let service: WeatherForecastService;
  let store: InstanceType<typeof WeatherForecastStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        WeatherForecastStore,
        { provide: 'BASE_URL', useValue: '' },
      ],
    });

    store = TestBed.inject(WeatherForecastStore);
    service = TestBed.inject(WeatherForecastService);
  });

  it('WeatherForecastStore onInit hook should call getForecasts(10)', () => {
    expect(store.count()).toBe(10);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBe(null);
  });

  xdescribe('signal store entities tests', () => {
    it('WeatherForecastStore.getForecasts() should return data', () => {
      jest
        .spyOn(service, 'getForecasts')
        .mockReturnValue(of([weatherForecasts[0]]));
      store.getForecasts({ count: 1, plus: false });

      expect(store.entities()).toEqual([weatherForecasts[0]]);
      expect(store.count()).toBe(1);
      expect(store.loading()).toBe(false);
    });

    it('WeatherForecastStore.getForecasts(count) should return data of length count', () => {
      jest.spyOn(service, 'getForecasts').mockReturnValue(of(weatherForecasts));
      store.getForecasts({ count: 10, plus: false });
      expect(store.entities().length).toBe(10);
      expect(store.count()).toBe(10);
      expect(store.loading()).toBe(false);
    });

    it('WeatherForecastStore.getForecasts(count) should catch error', () => {
      const error = { message: 'error' };
      jest
        .spyOn(service, 'getForecasts')
        .mockImplementation(() => throwError(() => error));
      store.getForecasts({ count: 10, plus: false });
      expect(store.entities().length).toBe(0);
      expect(store.count()).toBe(10);
      expect(store.loading()).toBe(false);
      expect(store.error()).toBe(error);
    });
  });
});
