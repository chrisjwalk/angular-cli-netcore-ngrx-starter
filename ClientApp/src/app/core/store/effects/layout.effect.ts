import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map, tap, catchError } from 'rxjs/operators';

import * as layoutActions from 'app/core/store/actions';


@Injectable()
export class LayoutEffects {
    constructor(
        private actions$: Actions,
        private titleService: Title
      ) { }

  @Effect({dispatch: false})
  setTitle$ = this.actions$
  .ofType<layoutActions.SetTitle>(layoutActions.LayoutActionTypes.SetTitle)
  .pipe(
    map(action => action.payload),
    tap(title => {
        this.titleService.setTitle(title + ' | Demo App');
    })
  );
}
