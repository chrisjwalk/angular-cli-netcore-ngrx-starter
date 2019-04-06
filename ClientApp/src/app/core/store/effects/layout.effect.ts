import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';

import * as layoutActions from 'app/core/store/actions';

@Injectable()
export class LayoutEffects {
  constructor(private actions$: Actions, private titleService: Title) {}

  @Effect({ dispatch: false })
  setTitle$ = this.actions$.pipe(
    ofType<layoutActions.SetTitle>(layoutActions.LayoutActionTypes.SetTitle),
    map((action) => action.payload),
    tap((title) => {
      this.titleService.setTitle(title + ' | Demo App');
    }),
  );
}
