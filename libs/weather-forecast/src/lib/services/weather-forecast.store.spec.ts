import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideComponentStore } from '@ngrx/component-store';
import { filter, of } from 'rxjs';

import { WeatherForecastService } from './weather-forecast.service';
import { weatherForecasts } from './weather-forecast.service.spec';
import { WeatherForecastStore } from './weather-forecast.store';

describe('WeatherForecastService', () => {
  let service: WeatherForecastService;
  let store: WeatherForecastStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, MatSnackBarModule],
      providers: [
        [provideComponentStore(WeatherForecastStore)],
        { provide: 'BASE_URL', useValue: '' },
      ],
    });

    store = TestBed.inject(WeatherForecastStore);
    service = TestBed.inject(WeatherForecastService);
  });

  it('WeatherForecastStore.getForecasts() should return data', () => {
    jest
      .spyOn(service, 'getForecasts')
      .mockReturnValue(of([weatherForecasts[0]]));
    store.getForecasts(1);

    expect(store.weatherForecasts()).toEqual([weatherForecasts[0]]);
  });

  it('WeatherForecastStore.getForecasts(count) should return data of length count', () => {
    jest.spyOn(service, 'getForecasts').mockReturnValue(of(weatherForecasts));
    store.getForecasts(10);
    expect(store.weatherForecasts().length).toBe(10);
  });
});
