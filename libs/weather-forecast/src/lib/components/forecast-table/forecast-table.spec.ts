import { render, screen } from '@testing-library/angular';
import { weatherForecasts } from '../../services/weather-forecast.service.spec';
import { ForecastTable } from './forecast-table';
import { BreakpointStore } from '@myorg/shared';
import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';

describe('ForecastTable', () => {
  test('should exist', async () => {
    await render(ForecastTable);

    expect(screen.getByTestId('lib-forecast-table')).toBeTruthy();
  });

  test('should have the correct number of rows', async () => {
    await render(ForecastTable, {
      componentInputs: { data: weatherForecasts },
    });

    expect(screen.getAllByTestId('table-row')).toHaveLength(
      weatherForecasts.length,
    );
  });

  test('should compute displayedColumns for default (not handset portrait)', async () => {
    const { fixture } = await render(ForecastTable);
    const instance = fixture.componentInstance;
    expect(instance.displayedColumns()).toEqual([
      'dateFormatted',
      'temperatureC',
      'temperatureF',
      'summary',
    ]);
  });

  test('should hide summary column when toggled', async () => {
    const { fixture } = await render(ForecastTable);
    const instance = fixture.componentInstance;
    instance.toggleColumnVisible('summary');
    expect(instance.displayedColumns()).not.toContain('summary');
  });

  test('should compute displayedColumns for handset portrait', async () => {
    const { fixture } = await render(ForecastTable);
    const instance = fixture.componentInstance;
    patchState(unprotected(instance.breakpointStore), {
      handsetPortrait: true,
    });
    // Assert the mock is used
    expect(instance.breakpointStore.handsetPortrait()).toBe(true);
    fixture.detectChanges();
    expect(instance.displayedColumns()).toEqual([
      'dateFormatted',
      'temperatureF',
    ]);
  });

  test('toggleColumnVisible toggles column visibility', async () => {
    const { fixture } = await render(ForecastTable);
    const instance = fixture.componentInstance;
    expect(
      instance.state.columns().find((c) => c.name === 'summary').visible,
    ).toBe(true);
    instance.toggleColumnVisible('summary');
    expect(
      instance.state.columns().find((c) => c.name === 'summary').visible,
    ).toBe(false);
    instance.toggleColumnVisible('summary');
    expect(
      instance.state.columns().find((c) => c.name === 'summary').visible,
    ).toBe(true);
  });

  test('toggleSummary toggles summary column', async () => {
    const { fixture } = await render(ForecastTable);
    const instance = fixture.componentInstance;
    expect(
      instance.state.columns().find((c) => c.name === 'summary').visible,
    ).toBe(true);
    instance.toggleSummary();
    expect(
      instance.state.columns().find((c) => c.name === 'summary').visible,
    ).toBe(false);
  });
});
