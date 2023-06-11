import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
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
      providers: [WeatherForecastStore, { provide: 'BASE_URL', useValue: '' }],
    });

    store = TestBed.inject(WeatherForecastStore);
    service = TestBed.inject(WeatherForecastService);
  });

  it('WeatherForecastStore.getForecasts() should return data', () => {
    store.getForecasts(1);
    jest
      .spyOn(service, 'getForecasts')
      .mockReturnValue(of([weatherForecasts[0]]));

    store.weatherForecasts$
      .pipe(filter((result) => !!result))
      .subscribe((result) => {
        expect(result).toEqual(weatherForecasts);
      });
  });

  it('WeatherForecastStore.getForecasts(count) should return data of length count', () => {
    store.getForecasts(10);
    jest.spyOn(service, 'getForecasts').mockReturnValue(of(weatherForecasts));
    store.weatherForecasts$
      .pipe(filter((result) => !!result))
      .subscribe((data) => {
        expect(data.length).toBe(10);
      });
  });
});
