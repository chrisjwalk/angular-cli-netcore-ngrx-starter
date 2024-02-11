import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { render, screen } from '@testing-library/angular';

import { weatherForecasts } from '../../services/weather-forecast.service.spec';
import { ForecastTableComponent } from './forecast-table.component';
import { Component } from '@angular/core';

describe('ForecastTableComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations()],
    });
  });

  test('should exist', async () => {
    await render(ForecastTableComponent);

    expect(screen.getByTestId('lib-forecast-table')).toBeTruthy();
  });

  test('should have the correct number of rows', () => {
    @Component({
      standalone: true,
      imports: [ForecastTableComponent],
      template: '<lib-forecast-table [data]="data" />',
    })
    class TestComponent {
      data = weatherForecasts;
    }

    TestBed.createComponent(TestComponent).detectChanges();

    expect(screen.getAllByTestId('table-row')).toHaveLength(
      weatherForecasts.length,
    );
  });
});
