import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { BreakpointStore } from './breakpoint.store';

describe('BreakpointStore', () => {
  let store: BreakpointStore;
  let breakpointSubject: Subject<{
    breakpoints: Record<string, boolean>;
    matches: boolean;
  }>;

  const ALL_BREAKPOINTS = [
    Breakpoints.XSmall,
    Breakpoints.Small,
    Breakpoints.Medium,
    Breakpoints.Large,
    Breakpoints.XLarge,
    Breakpoints.HandsetPortrait,
    Breakpoints.TabletPortrait,
    Breakpoints.WebPortrait,
    Breakpoints.HandsetLandscape,
    Breakpoints.TabletLandscape,
    Breakpoints.WebLandscape,
  ];

  function emitBreakpoints(active: string[]) {
    const breakpoints: Record<string, boolean> = Object.fromEntries(
      ALL_BREAKPOINTS.map((bp) => [bp, active.includes(bp)]),
    );
    breakpointSubject.next({ breakpoints, matches: active.length > 0 });
  }

  beforeEach(() => {
    breakpointSubject = new Subject();

    TestBed.configureTestingModule({
      providers: [
        BreakpointStore,
        {
          provide: BreakpointObserver,
          useValue: { observe: () => breakpointSubject.asObservable() },
        },
      ],
    });

    store = TestBed.inject(BreakpointStore);
  });

  it('should be created', () => {
    expect(store).toBeDefined();
  });

  it('should initialise with all breakpoints false', () => {
    expect(store.xsmall()).toBe(false);
    expect(store.small()).toBe(false);
    expect(store.medium()).toBe(false);
    expect(store.large()).toBe(false);
    expect(store.xlarge()).toBe(false);
    expect(store.handset()).toBe(false);
    expect(store.tablet()).toBe(false);
    expect(store.web()).toBe(false);
    expect(store.handsetPortrait()).toBe(false);
    expect(store.tabletPortrait()).toBe(false);
    expect(store.webPortrait()).toBe(false);
    expect(store.handsetLandscape()).toBe(false);
    expect(store.tabletLandscape()).toBe(false);
    expect(store.webLandscape()).toBe(false);
  });

  it('should set xsmall when XSmall breakpoint matches', () => {
    emitBreakpoints([Breakpoints.XSmall]);
    expect(store.xsmall()).toBe(true);
    expect(store.small()).toBe(false);
  });

  it('should set small when Small breakpoint matches', () => {
    emitBreakpoints([Breakpoints.Small]);
    expect(store.small()).toBe(true);
    expect(store.xsmall()).toBe(false);
  });

  it('should set medium when Medium breakpoint matches', () => {
    emitBreakpoints([Breakpoints.Medium]);
    expect(store.medium()).toBe(true);
  });

  it('should set large when Large breakpoint matches', () => {
    emitBreakpoints([Breakpoints.Large]);
    expect(store.large()).toBe(true);
  });

  it('should set xlarge when XLarge breakpoint matches', () => {
    emitBreakpoints([Breakpoints.XLarge]);
    expect(store.xlarge()).toBe(true);
  });

  it('should set handset and handsetPortrait when HandsetPortrait matches', () => {
    emitBreakpoints([Breakpoints.HandsetPortrait]);
    expect(store.handset()).toBe(true);
    expect(store.handsetPortrait()).toBe(true);
    expect(store.handsetLandscape()).toBe(false);
  });

  it('should set handset and handsetLandscape when HandsetLandscape matches', () => {
    emitBreakpoints([Breakpoints.HandsetLandscape]);
    expect(store.handset()).toBe(true);
    expect(store.handsetLandscape()).toBe(true);
    expect(store.handsetPortrait()).toBe(false);
  });

  it('should set tablet and tabletPortrait when TabletPortrait matches', () => {
    emitBreakpoints([Breakpoints.TabletPortrait]);
    expect(store.tablet()).toBe(true);
    expect(store.tabletPortrait()).toBe(true);
    expect(store.tabletLandscape()).toBe(false);
  });

  it('should set tablet and tabletLandscape when TabletLandscape matches', () => {
    emitBreakpoints([Breakpoints.TabletLandscape]);
    expect(store.tablet()).toBe(true);
    expect(store.tabletLandscape()).toBe(true);
    expect(store.tabletPortrait()).toBe(false);
  });

  it('should set web and webPortrait when WebPortrait matches', () => {
    emitBreakpoints([Breakpoints.WebPortrait]);
    expect(store.web()).toBe(true);
    expect(store.webPortrait()).toBe(true);
    expect(store.webLandscape()).toBe(false);
  });

  it('should set web and webLandscape when WebLandscape matches', () => {
    emitBreakpoints([Breakpoints.WebLandscape]);
    expect(store.web()).toBe(true);
    expect(store.webLandscape()).toBe(true);
    expect(store.webPortrait()).toBe(false);
  });

  it('should update multiple signals simultaneously', () => {
    emitBreakpoints([Breakpoints.Large, Breakpoints.WebLandscape]);
    expect(store.large()).toBe(true);
    expect(store.web()).toBe(true);
    expect(store.webLandscape()).toBe(true);
    expect(store.small()).toBe(false);
  });

  it('should clear previous signals when breakpoints change', () => {
    emitBreakpoints([Breakpoints.XSmall]);
    expect(store.xsmall()).toBe(true);

    emitBreakpoints([Breakpoints.Large]);
    expect(store.xsmall()).toBe(false);
    expect(store.large()).toBe(true);
  });

  it('should set all signals to false when no breakpoints match', () => {
    emitBreakpoints([Breakpoints.HandsetPortrait]);
    expect(store.handset()).toBe(true);

    emitBreakpoints([]);
    expect(store.handset()).toBe(false);
    expect(store.handsetPortrait()).toBe(false);
  });
});
