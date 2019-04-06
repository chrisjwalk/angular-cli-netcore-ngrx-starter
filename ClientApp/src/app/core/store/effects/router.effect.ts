import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { tap, map } from 'rxjs/operators';

import { AppService } from 'app/core/services';
import * as RouterActions from 'app/core/store/actions/router.action';
import { RouterStateUrl } from 'app/core/store/reducers';

@Injectable()
export class RouterEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private location: Location,
    private appService: AppService,
  ) {}

  @Effect({ dispatch: false })
  routerNavigation$ = this.actions$.pipe(
    ofType(RouterActions.NAVIGATION),
    map((action: RouterActions.RouterNavigation) => action.payload),
    tap((routerNavigationPayload) => {
      const event = routerNavigationPayload.event;
      const routerState: RouterStateUrl = routerNavigationPayload.routerState;
      this.appService.scrollToTop(false);
    }),
  );

  @Effect({ dispatch: false })
  navigate$ = this.actions$.pipe(
    ofType(RouterActions.RouterActionTypes.GO),
    map((action: RouterActions.Go) => action.payload),
    tap(({ path, query: queryParams, extras }) =>
      this.router.navigate(path, { queryParams, ...extras }),
    ),
  );

  @Effect({ dispatch: false })
  navigateBack$ = this.actions$.pipe(
    ofType(RouterActions.RouterActionTypes.BACK),
    tap(() => this.location.back()),
  );

  @Effect({ dispatch: false })
  navigateForward$ = this.actions$.pipe(
    ofType(RouterActions.RouterActionTypes.FORWARD),
    tap(() => this.location.forward()),
  );
}
