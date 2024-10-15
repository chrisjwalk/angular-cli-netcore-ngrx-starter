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
        combineLatest([
          breakpointObserver.observe(Breakpoints.XSmall),
          breakpointObserver.observe(Breakpoints.Small),
          breakpointObserver.observe(Breakpoints.Medium),
          breakpointObserver.observe(Breakpoints.Large),
          breakpointObserver.observe(Breakpoints.XLarge),
          breakpointObserver.observe(Breakpoints.Handset),
          breakpointObserver.observe(Breakpoints.Tablet),
          breakpointObserver.observe(Breakpoints.Web),
          breakpointObserver.observe(Breakpoints.HandsetPortrait),
          breakpointObserver.observe(Breakpoints.TabletPortrait),
          breakpointObserver.observe(Breakpoints.WebPortrait),
          breakpointObserver.observe(Breakpoints.HandsetLandscape),
          breakpointObserver.observe(Breakpoints.TabletLandscape),
          breakpointObserver.observe(Breakpoints.WebLandscape),
        ]).pipe(
          debounceTime(0),
          map((result) => ({
            xsmall: result[0],
            small: result[1],
            medium: result[2],
            large: result[3],
            xlarge: result[4],
            handset: result[5],
            tablet: result[6],
            web: result[7],
            handsetPortrait: result[8],
            tabletPortrait: result[9],
            webPortrait: result[10],
            handsetLandscape: result[11],
            tabletLandscape: result[12],
            webLandscape: result[13],
          })),
        ),
      );
    },
  })),
);
