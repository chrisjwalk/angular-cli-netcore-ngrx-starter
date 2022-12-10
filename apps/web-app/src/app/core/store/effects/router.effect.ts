import { Location, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import * as RouterActions from '../../../core/store/actions/router.action';

@Injectable()
export class RouterEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private location: Location,
    @Inject(PLATFORM_ID) private platformId,
  ) {}

  routerNavigation = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RouterActions.routerNavigation),
        tap(() => {
          this.scrollToTop(false);
        }),
      ),
    { dispatch: false },
  );

  navigate = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RouterActions.go),
        tap(({ path, query: queryParams, extras }) =>
          this.router.navigate(path, { queryParams, ...extras }),
        ),
      ),
    { dispatch: false },
  );

  navigateBack = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RouterActions.back),
        tap(() => this.location.back()),
      ),
    { dispatch: false },
  );

  navigateForward = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RouterActions.forward),
        tap(() => this.location.forward()),
      ),
    { dispatch: false },
  );

  private getMdSidenavContent(): Element {
    let mdSidenavContent: Element = null;
    if (isPlatformBrowser(this.platformId)) {
      const appSidenavContainer: HTMLElement = document.getElementById(
        'appSidenavContainer',
      );
      if (appSidenavContainer) {
        const sideNavContent =
          appSidenavContainer.getElementsByClassName('mat-drawer-content');
        if (sideNavContent.length) {
          mdSidenavContent = sideNavContent[0];
        }
      }
    }

    return mdSidenavContent;
  }

  private scrollToTop(animate: boolean = false) {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
      const mdSidenavContent = this.getMdSidenavContent();
      if (mdSidenavContent) {
        if (animate) {
          // t: current time, b: begInnIng value, c: change In value, d: duration
          const easeOutExpo = (x, t, b, c, d) => {
            return t === d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
          };
          const start = Date.now();
          const duration = 1000;
          const ease = (x) => {
            const t = (Date.now() - start) / 10;
            const b = mdSidenavContent.scrollTop;
            const c = -b;
            const d = duration;
            return Math.floor(easeOutExpo(x, t, b, c, d));
          };
          const loop = () => {
            if (mdSidenavContent.scrollTop > 0) {
              mdSidenavContent.scrollTop = ease(mdSidenavContent.scrollTop);
              setTimeout(() => {
                loop();
              }, 0);
            }
          };
          loop();
        } else {
          mdSidenavContent.scrollTop = 0;
        }
      }
    }
  }
}
