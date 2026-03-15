import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { EMPTY, Subject } from 'rxjs';

import { SwUpdateStore, swUpdateInitialState } from './sw-update.store';

describe('SwUpdateStore', () => {
  let store: SwUpdateStore;
  let snackBar: MatSnackBar;
  let versionUpdatesSubject: Subject<VersionEvent>;
  let routerEventsSubject: Subject<NavigationEnd>;

  function setup(isEnabled: boolean) {
    versionUpdatesSubject = new Subject<VersionEvent>();
    routerEventsSubject = new Subject<NavigationEnd>();

    TestBed.configureTestingModule({
      providers: [
        provideNoopAnimations(),
        SwUpdateStore,
        {
          provide: SwUpdate,
          useValue: {
            isEnabled,
            versionUpdates: versionUpdatesSubject.asObservable(),
            activateUpdate: vi.fn().mockResolvedValue(undefined),
            checkForUpdate: vi.fn().mockResolvedValue(false),
          },
        },
        {
          provide: Router,
          useValue: { events: routerEventsSubject.asObservable() },
        },
      ],
    });

    store = TestBed.inject(SwUpdateStore);
    snackBar = TestBed.inject(MatSnackBar);
  }

  beforeEach(() => setup(true));

  it('should be created', () => {
    expect(store).toBeDefined();
  });

  it('should have correct initial state', () => {
    expect(store.message()).toBe(swUpdateInitialState.message);
    expect(store.action()).toBe(swUpdateInitialState.action);
    expect(store.snackbarConfig()).toEqual(swUpdateInitialState.snackbarConfig);
  });

  it('updateReady should be false initially', () => {
    expect(store.updateReady()).toBe(false);
  });

  it('updateReady should be true when a VERSION_READY event is received', () => {
    versionUpdatesSubject.next({
      type: 'VERSION_READY',
      currentVersion: { hash: 'abc', appData: null },
      latestVersion: { hash: 'def', appData: null },
    } as VersionEvent);

    expect(store.updateReady()).toBe(true);
  });

  it('updateReady should remain false for VERSION_DETECTED events', () => {
    versionUpdatesSubject.next({
      type: 'VERSION_DETECTED',
      version: { hash: 'def', appData: null },
    } as VersionEvent);

    expect(store.updateReady()).toBe(false);
  });

  it('updateReady should remain false for VERSION_INSTALLATION_FAILED events', () => {
    versionUpdatesSubject.next({
      type: 'VERSION_INSTALLATION_FAILED',
      version: { hash: 'def', appData: null },
      error: 'install failed',
    } as VersionEvent);

    expect(store.updateReady()).toBe(false);
  });

  it('should open snackbar with correct args when VERSION_READY event is received', () => {
    const openSpy = vi.spyOn(snackBar, 'open').mockReturnValue({
      onAction: () => EMPTY,
      dismiss: vi.fn(),
      afterDismissed: () => EMPTY,
      afterOpened: () => EMPTY,
      instance: {} as never,
      containerInstance: {} as never,
    });

    versionUpdatesSubject.next({
      type: 'VERSION_READY',
      currentVersion: { hash: 'abc', appData: null },
      latestVersion: { hash: 'def', appData: null },
    } as VersionEvent);

    expect(openSpy).toHaveBeenCalledWith(
      swUpdateInitialState.message,
      swUpdateInitialState.action,
      swUpdateInitialState.snackbarConfig,
    );
  });

  it('should not open snackbar for VERSION_DETECTED events', () => {
    const openSpy = vi.spyOn(snackBar, 'open');

    versionUpdatesSubject.next({
      type: 'VERSION_DETECTED',
      version: { hash: 'def', appData: null },
    } as VersionEvent);

    expect(openSpy).not.toHaveBeenCalled();
  });

  it('should not open snackbar for VERSION_INSTALLATION_FAILED events', () => {
    const openSpy = vi.spyOn(snackBar, 'open');

    versionUpdatesSubject.next({
      type: 'VERSION_INSTALLATION_FAILED',
      version: { hash: 'def', appData: null },
      error: 'install failed',
    } as VersionEvent);

    expect(openSpy).not.toHaveBeenCalled();
  });

  it('should call activateUpdate when snackbar action is clicked', async () => {
    const activateUpdateSpy = vi.spyOn(
      TestBed.inject(SwUpdate),
      'activateUpdate',
    );
    const actionSubject = new Subject<void>();
    vi.spyOn(snackBar, 'open').mockReturnValue({
      onAction: () => actionSubject.asObservable(),
      dismiss: vi.fn(),
      afterDismissed: () => EMPTY,
      afterOpened: () => EMPTY,
      instance: {} as never,
      containerInstance: {} as never,
    });

    versionUpdatesSubject.next({
      type: 'VERSION_READY',
      currentVersion: { hash: 'abc', appData: null },
      latestVersion: { hash: 'def', appData: null },
    } as VersionEvent);

    actionSubject.next();
    await TestBed.inject(ApplicationRef).whenStable();

    expect(activateUpdateSpy).toHaveBeenCalled();
  });

  it('should call checkForUpdate on NavigationEnd', () => {
    const checkSpy = vi.spyOn(TestBed.inject(SwUpdate), 'checkForUpdate');

    routerEventsSubject.next(new NavigationEnd(1, '/', '/'));

    expect(checkSpy).toHaveBeenCalledTimes(1);
  });

  it('should not call checkForUpdate when SwUpdate is disabled', () => {
    TestBed.resetTestingModule();
    setup(false);
    const checkSpy = vi.spyOn(TestBed.inject(SwUpdate), 'checkForUpdate');

    routerEventsSubject.next(new NavigationEnd(1, '/', '/'));

    expect(checkSpy).not.toHaveBeenCalled();
  });

  it('should not subscribe to versionUpdates when SwUpdate is disabled', () => {
    TestBed.resetTestingModule();
    setup(false);

    const openSpy = vi.spyOn(snackBar, 'open');

    versionUpdatesSubject.next({
      type: 'VERSION_READY',
      currentVersion: { hash: 'abc', appData: null },
      latestVersion: { hash: 'def', appData: null },
    } as VersionEvent);

    expect(openSpy).not.toHaveBeenCalled();
  });
});
