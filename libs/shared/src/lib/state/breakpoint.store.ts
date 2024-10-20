import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  signalStoreFeature,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { map, pipe, tap } from 'rxjs';

export function withBreakpointFeature() {
  return signalStoreFeature(
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
      rxBreakpointObserver: rxMethod<BreakpointState>(
        pipe(
          map((result) => result.breakpoints),
          tap((matches) =>
            patchState(store, {
              xsmall: matches[Breakpoints.XSmall],
              small: matches[Breakpoints.Small],
              medium: matches[Breakpoints.Medium],
              large: matches[Breakpoints.Large],
              xlarge: matches[Breakpoints.XLarge],
              handset:
                matches[Breakpoints.HandsetPortrait] ||
                matches[Breakpoints.HandsetLandscape],
              tablet:
                matches[Breakpoints.TabletPortrait] ||
                matches[Breakpoints.TabletLandscape],
              web:
                matches[Breakpoints.WebPortrait] ||
                matches[Breakpoints.WebLandscape],
              handsetPortrait: matches[Breakpoints.HandsetPortrait],
              tabletPortrait: matches[Breakpoints.TabletPortrait],
              webPortrait: matches[Breakpoints.WebPortrait],
              handsetLandscape: matches[Breakpoints.HandsetLandscape],
              tabletLandscape: matches[Breakpoints.TabletLandscape],
              webLandscape: matches[Breakpoints.WebLandscape],
            }),
          ),
        ),
      ),
    })),
    withHooks((store, breakpointObserver = inject(BreakpointObserver)) => ({
      onInit() {
        store.rxBreakpointObserver(
          breakpointObserver.observe([
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
          ]),
        );
      },
    })),
  );
}

export const BreakpointStore = signalStore(withBreakpointFeature());
