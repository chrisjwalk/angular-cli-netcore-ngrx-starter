import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { provideMockActions } from '@ngrx/effects/testing';
import { addMatchers, cold, hot, initTestScheduler } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';

import { WeatherForecast } from '../../models/weather-forecast';
import { ForecastsService } from '../../services/forecasts.service';
import * as forecastActions from '../actions/forecast.actions';
import { ForecastEffects } from './forecast.effects';

describe('Forecast Effects', () => {
  let effects: ForecastEffects;
  let actions: Observable<any>;
  let service: ForecastsService;
  let getWeatherSpy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatSnackBarModule,
        BrowserTransferStateModule,
      ],
      providers: [
        ForecastEffects,
        provideMockActions(() => actions),
        ForecastsService,
        { provide: 'BASE_URL', useValue: '' },
      ],
    });

    effects = TestBed.inject(ForecastEffects);
    service = TestBed.inject(ForecastsService);
    initTestScheduler();
    addMatchers();
  });

  it('ForecastActions.Load() should return data', () => {
    const weatherForecasts: WeatherForecast[] = [
      {
        id: 'test-0',
        dateFormatted: '',
        temperatureC: 0,
        temperatureF: 32,
        summary: 'Test',
      },
    ];
    getWeatherSpy = spyOn(service, 'getWeather').and.returnValue(
      of(weatherForecasts),
    );
    const action = forecastActions.load({ count: 10 });
    const completion = forecastActions.loadComplete({ weatherForecasts });

    actions = hot('--a-', { a: action });
    const expected = cold('--b', { b: completion });

    expect(effects.load$).toBeObservable(expected);
  });
});
