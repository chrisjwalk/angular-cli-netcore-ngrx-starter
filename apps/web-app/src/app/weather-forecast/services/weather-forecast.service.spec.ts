import { HttpClientModule } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { WeatherForecast } from '../models/weather-forecast';
import { WeatherForecastService } from './weather-forecast.service';

describe('WeatherForecastService', () => {
  let service: WeatherForecastService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, MatSnackBarModule, HttpClientTestingModule],
      providers: [{ provide: 'BASE_URL', useValue: '' }],
    });

    service = TestBed.inject(WeatherForecastService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('WeatherForecastService.getForecasts() should return data', () => {
    const weatherForecasts: WeatherForecast[] = [
      {
        id: 'test-0',
        dateFormatted: '',
        temperatureC: 0,
        temperatureF: 32,
        summary: 'Test',
      },
    ];

    service.getForecasts(1).subscribe((result) => {
      expect(result).toEqual(weatherForecasts);
    });

    const req = httpTestingController.expectOne(
      '/api/weatherforecasts?count=1',
    );
    expect(req.request.method).toEqual('GET');
    req.flush(weatherForecasts);
  });
});
