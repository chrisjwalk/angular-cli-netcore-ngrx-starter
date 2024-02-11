import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { fireEvent, render, screen } from '@testing-library/angular';

import { CounterComponent } from './counter.component';

describe('CounterComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations()],
    });
  });

  test('should exist', async () => {
    await render(CounterComponent);

    expect(screen.getByTestId('lib-counter')).toBeTruthy();
  });

  test('should render counter', async () => {
    const count = 5;
    @Component({
      standalone: true,
      imports: [CounterComponent],
      template: '<lib-counter [count]="count" />',
    })
    class TestComponent {
      count = count;
    }

    TestBed.createComponent(TestComponent).detectChanges();
    expect(screen.getByTestId('count').innerHTML?.trim()).toBe(`${count}`);
  });

  test('should emit increment event on click', async () => {
    const count = 5;
    const increment = jest.fn();

    @Component({
      standalone: true,
      imports: [CounterComponent],
      template: '<lib-counter [count]="count" (increment)="increment()" />',
    })
    class TestComponent {
      count = count;
      increment = increment;
    }

    TestBed.createComponent(TestComponent).detectChanges();
    fireEvent.click(screen.getByText('keyboard_arrow_right'));
    expect(increment).toHaveBeenCalledTimes(1);
  });
});
