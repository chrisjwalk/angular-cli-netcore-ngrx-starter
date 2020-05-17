import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { EntityDataModule } from '@ngrx/data';
import { addMatchers, cold, hot, initTestScheduler } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';

import { WeatherForecast } from '../models/weather-forecast';
import { WeatherForecastService } from '../services/weather-forecast.service';
import { entityConfig } from 'app/core/store/data/entity-metadata';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { switchMap } from 'rxjs/operators';

describe('WeatherForecastService', () => {
  let actions: Observable<any>;
  let service: WeatherForecastService;
  let getWeatherSpy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatSnackBarModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        EntityDataModule.forRoot(entityConfig),
      ],
      providers: [
        WeatherForecastService,
        { provide: 'BASE_URL', useValue: '' },
      ],
    });

    service = TestBed.inject(WeatherForecastService);
    initTestScheduler();
    addMatchers();
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
    getWeatherSpy = spyOn(service, 'getWithQuery').and.returnValue(
      of(weatherForecasts)
    );
    const expected = cold('(a|)', { a: weatherForecasts });
    expect(service.getForecasts(1)).toBeObservable(expected);
  });

  fit('WeatherForecastService.refresh(count) should return data of length count', () => {
    const weatherForecasts: WeatherForecast[] = [
      {
        id: '1f86db2a-1c72-4fec-bada-c0e52e29a897',
        dateFormatted: '5/11/2020',
        temperatureC: 51,
        summary: 'Freezing',
        temperatureF: 123,
      },
      {
        id: '898b2cc3-8e0b-4699-b4d9-43b33abc4ab2',
        dateFormatted: '5/12/2020',
        temperatureC: -6,
        summary: 'Warm',
        temperatureF: 22,
      },
      {
        id: '59c80e4b-f5b0-432b-ae29-40ea9cf28a54',
        dateFormatted: '5/13/2020',
        temperatureC: 23,
        summary: 'Balmy',
        temperatureF: 73,
      },
      {
        id: 'f2212624-b5ad-4abb-bf21-fcdb0ae28a1b',
        dateFormatted: '5/14/2020',
        temperatureC: -2,
        summary: 'Cool',
        temperatureF: 29,
      },
      {
        id: '37844e8b-c032-436b-800f-35fa7b08502f',
        dateFormatted: '5/15/2020',
        temperatureC: 34,
        summary: 'Warm',
        temperatureF: 93,
      },
      {
        id: 'afc47199-4e92-4c16-9d67-a748b338ff4d',
        dateFormatted: '5/16/2020',
        temperatureC: -17,
        summary: 'Bracing',
        temperatureF: 2,
      },
      {
        id: '00b7e43c-609e-4a7d-a0f2-c1284c6370ff',
        dateFormatted: '5/17/2020',
        temperatureC: -17,
        summary: 'Chilly',
        temperatureF: 2,
      },
      {
        id: '43131c3f-4cf7-4953-8863-a89bbcbb3ab6',
        dateFormatted: '5/18/2020',
        temperatureC: 52,
        summary: 'Warm',
        temperatureF: 125,
      },
      {
        id: '5d4fefa4-bf8c-4c74-8268-e175804a9649',
        dateFormatted: '5/19/2020',
        temperatureC: -4,
        summary: 'Mild',
        temperatureF: 25,
      },
      {
        id: 'a2f882f7-d681-429a-8f60-df57e332083e',
        dateFormatted: '5/20/2020',
        temperatureC: 3,
        summary: 'Bracing',
        temperatureF: 37,
      },
    ];
    getWeatherSpy = spyOn(service, 'getWithQuery').and.returnValue(
      of(weatherForecasts)
    );
    service.refresh(10).subscribe(data => {
      expect(data.length).toBe(10);
    })
  });
});
