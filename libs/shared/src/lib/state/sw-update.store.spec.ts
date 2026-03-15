import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { Subject } from 'rxjs';

import { NotificationStore } from './notification.store';
import { SwUpdateStore, swUpdateInitialState } from './sw-update.store';

describe('SwUpdateStore', () => {
  let store: SwUpdateStore;
  let notificationStore: InstanceType<typeof NotificationStore>;
  let versionUpdatesSubject: Subject<VersionEvent>;

  function setup(isEnabled: boolean) {
    versionUpdatesSubject = new Subject<VersionEvent>();

    TestBed.configureTestingModule({
      providers: [
        provideNoopAnimations(),
        NotificationStore,
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
      ],
    });

    store = TestBed.inject(SwUpdateStore);
    notificationStore = TestBed.inject(NotificationStore);
  }

  beforeEach(() => setup(true));

  it('should be created', () => {
    expect(store).toBeDefined();
  });

  it('should have correct initial versionEvent state', () => {
    expect(store.versionEvent()).toEqual(swUpdateInitialState.versionEvent);
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

  it('should add a sw-update notification when VERSION_READY event is received', () => {
    versionUpdatesSubject.next({
      type: 'VERSION_READY',
      currentVersion: { hash: 'abc', appData: null },
      latestVersion: { hash: 'def', appData: null },
    } as VersionEvent);

    expect(notificationStore.notifications()).toHaveLength(1);
    expect(notificationStore.notifications()[0]).toMatchObject({
      kind: 'sw-update',
      title: 'App update available',
    });
  });

  it('should not add notification for VERSION_DETECTED events', () => {
    versionUpdatesSubject.next({
      type: 'VERSION_DETECTED',
      version: { hash: 'def', appData: null },
    } as VersionEvent);

    expect(notificationStore.notifications()).toHaveLength(0);
  });

  it('should not add notification for VERSION_INSTALLATION_FAILED events', () => {
    versionUpdatesSubject.next({
      type: 'VERSION_INSTALLATION_FAILED',
      version: { hash: 'def', appData: null },
      error: 'install failed',
    } as VersionEvent);

    expect(notificationStore.notifications()).toHaveLength(0);
  });

  it('should call activateUpdate when notification action is triggered', async () => {
    const activateUpdateSpy = vi.spyOn(
      TestBed.inject(SwUpdate),
      'activateUpdate',
    );

    versionUpdatesSubject.next({
      type: 'VERSION_READY',
      currentVersion: { hash: 'abc', appData: null },
      latestVersion: { hash: 'def', appData: null },
    } as VersionEvent);

    const notification = notificationStore.notifications()[0];
    await notification.action?.handler();
    await TestBed.inject(ApplicationRef).whenStable();

    expect(activateUpdateSpy).toHaveBeenCalled();
  });

  it('should not subscribe to versionUpdates when SwUpdate is disabled', () => {
    TestBed.resetTestingModule();
    setup(false);

    versionUpdatesSubject.next({
      type: 'VERSION_READY',
      currentVersion: { hash: 'abc', appData: null },
      latestVersion: { hash: 'def', appData: null },
    } as VersionEvent);

    expect(notificationStore.notifications()).toHaveLength(0);
  });
});
