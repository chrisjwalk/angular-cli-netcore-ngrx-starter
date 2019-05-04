import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';

import { WeatherForecast } from '../../models/weather-forecast';
import { ForecastsService } from '../../services/forecasts.service';
import * as ForecastActions from '../actions/forecast.actions';
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

    effects = TestBed.get(ForecastEffects);
    service = TestBed.get(ForecastsService);
  });

  it('ForecastActions.Load() should return data', () => {
    const data: WeatherForecast[] = [
      {
        id: 'test-0',
        dateFormatted: '',
        temperatureC: 0,
        temperatureF: 32,
        summary: 'Test',
      },
    ];
    getWeatherSpy = spyOn(service, 'getWeather').and.returnValue(of(data));
    const action = new ForecastActions.Load();
    const completion = new ForecastActions.LoadComplete(data);

    actions = hot('--a-', { a: action });
    const expected = cold('--b', { b: completion });

    expect(effects.load$).toBeObservable(expected);
  });
});
