import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { waitForElement } from '@myorg/shared';
import { fireEvent, screen } from '@testing-library/angular';

import { App } from './app';
import { routes } from './app.routes';

describe('App Integration', () => {
  let applicationRef: ApplicationRef;

  class MockSwUpdate {
    readonly isEnabled = false;
    readonly versionUpdates = {
      subscribe: () => {
        // No-op for testing
      },
    };
    activateUpdate = async () => {
      // No-op for testing
    };
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(routes),
        provideLocationMocks(),
        { provide: SwUpdate, useClass: MockSwUpdate },
      ],
    }).compileComponents();

    applicationRef = TestBed.inject(ApplicationRef);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should navigate to / and load the home feature', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    router.initialNavigation();
    // Wait for the home feature to load
    const compiled = fixture.nativeElement as HTMLElement;
    const pageToolbar = await waitForElement(
      () => compiled.querySelector('[data-testid="lib-page-toolbar"]'),
      applicationRef,
    );
    expect(pageToolbar.textContent?.toLowerCase()).toContain('home');
    const pageContainer = compiled.querySelector(
      '[data-testid="lib-page-container"]',
    );
    expect(pageContainer).toBeTruthy();
  });

  it('should navigate to /weather-forecast and load the feature', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/weather-forecast');
    // Wait for the weather-forecast feature to load
    const compiled = fixture.nativeElement as HTMLElement;
    const wfComponent = await waitForElement(
      () => compiled.querySelector('[data-testid="lib-weather-forecast"]'),
      applicationRef,
    );
    expect(wfComponent).toBeTruthy();
    const wfContainer = compiled.querySelector(
      '[data-testid="lib-page-container"]',
    );
    expect(wfContainer).toBeTruthy();
  });

  it('should navigate to /login and load the login feature', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/login');
    const compiled = fixture.nativeElement as HTMLElement;
    const loginComponent = await waitForElement(
      () => compiled.querySelector('[data-testid="lib-login"]'),
      applicationRef,
    );
    expect(loginComponent).toBeTruthy();
    const pageContainer = compiled.querySelector(
      '[data-testid="lib-page-container"]',
    );
    expect(pageContainer).toBeTruthy();
  });

  it('should navigate to /feature and load the counter feature', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/feature');
    const compiled = fixture.nativeElement as HTMLElement;
    // Wait for the counter container to appear
    const counterContainer = await waitForElement(
      () => compiled.querySelector('[data-testid="lib-counter-container"]'),
      applicationRef,
    );
    expect(counterContainer).toBeTruthy();
    // Now check for the counter component inside the container
    const counterComponent = counterContainer.querySelector(
      '[data-testid="lib-counter"]',
    );
    expect(counterComponent).toBeTruthy();
    const pageContainer = compiled.querySelector(
      '[data-testid="lib-page-container"]',
    );
    expect(pageContainer).toBeTruthy();
  });

  it('should increment and decrement the counter value when buttons are clicked', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/feature');
    const compiled = fixture.nativeElement as HTMLElement;
    // Wait for the counter container to appear
    await waitForElement(
      () => compiled.querySelector('[data-testid="lib-counter-container"]'),
      applicationRef,
    );
    // Use screen to get the counter and buttons
    const getCount = () =>
      Number(screen.getByTestId('count').textContent?.trim());
    const incrementButton = screen.getByLabelText('Increment');
    const decrementButton = screen.getByLabelText('Decrement');

    // Initial value
    const initial = getCount();
    // Click increment
    await fireEvent.click(incrementButton);
    applicationRef.tick();
    expect(getCount()).toBe(initial + 1);
    // Click decrement
    await fireEvent.click(decrementButton);
    applicationRef.tick();
    expect(getCount()).toBe(initial);
  });
});
