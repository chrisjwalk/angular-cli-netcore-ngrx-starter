import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { combineLatest, debounceTime, map, pipe } from 'rxjs';

export const BreakpointStore = signalStore(
  withState({
    xsmall: false,
    small: false,
    medium: false,
    large: false,
    xlarge: false,
    handset: false,
    tablet: false,
    web: false,
    handsetPortrait: false,
    tabletPortrait: false,
    webPortrait: false,
    handsetLandscape: false,
    tabletLandscape: false,
    webLandscape: false,
  }),
  withMethods((store) => ({
    rxBreakpointObserver: rxMethod<{
      xsmall: BreakpointState;
      small: BreakpointState;
      medium: BreakpointState;
      large: BreakpointState;
      xlarge: BreakpointState;
      handset: BreakpointState;
      tablet: BreakpointState;
      web: BreakpointState;
      handsetPortrait: BreakpointState;
      tabletPortrait: BreakpointState;
      webPortrait: BreakpointState;
      handsetLandscape: BreakpointState;
      tabletLandscape: BreakpointState;
      webLandscape: BreakpointState;
    }>(
      pipe(
        debounceTime(0),
        map(
          ({
            xsmall,
            small,
            medium,
            large,
            xlarge,
            handset,
            tablet,
            web,
            handsetPortrait,
            tabletPortrait,
            webPortrait,
            handsetLandscape,
            tabletLandscape,
            webLandscape,
          }) =>
            patchState(store, {
              xsmall: xsmall.matches,
              small: small.matches,
              medium: medium.matches,
              large: large.matches,
              xlarge: xlarge.matches,
              handset: handset.matches,
              tablet: tablet.matches,
              web: web.matches,
              handsetPortrait: handsetPortrait.matches,
              tabletPortrait: tabletPortrait.matches,
              webPortrait: webPortrait.matches,
              handsetLandscape: handsetLandscape.matches,
              tabletLandscape: tabletLandscape.matches,
              webLandscape: webLandscape.matches,
            }),
        ),
      ),
    ),
  })),
  withHooks((store, breakpointObserver = inject(BreakpointObserver)) => ({
    onInit() {
      store.rxBreakpointObserver(
        combineLatest({
          xsmall: breakpointObserver.observe(Breakpoints.XSmall),
          small: breakpointObserver.observe(Breakpoints.Small),
          medium: breakpointObserver.observe(Breakpoints.Medium),
          large: breakpointObserver.observe(Breakpoints.Large),
          xlarge: breakpointObserver.observe(Breakpoints.XLarge),
          handset: breakpointObserver.observe(Breakpoints.Handset),
          tablet: breakpointObserver.observe(Breakpoints.Tablet),
          web: breakpointObserver.observe(Breakpoints.Web),
          handsetPortrait: breakpointObserver.observe(
            Breakpoints.HandsetPortrait,
          ),
          tabletPortrait: breakpointObserver.observe(
            Breakpoints.TabletPortrait,
          ),
          webPortrait: breakpointObserver.observe(Breakpoints.WebPortrait),
          handsetLandscape: breakpointObserver.observe(
            Breakpoints.HandsetLandscape,
          ),
          tabletLandscape: breakpointObserver.observe(
            Breakpoints.TabletLandscape,
          ),
          webLandscape: breakpointObserver.observe(Breakpoints.WebLandscape),
        }),
      );
    },
  })),
);
