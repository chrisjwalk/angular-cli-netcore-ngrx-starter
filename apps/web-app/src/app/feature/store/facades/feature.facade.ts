import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import * as actions from '../actions';
import * as reducer from '../reducers';

@Injectable({ providedIn: 'root' })
export class FeatureFacade {
  count$ = this.store.pipe(select(reducer.getCount));

  constructor(private store: Store<reducer.State>) {}

  setCount(count: number) {
    this.store.dispatch(actions.setCount({ count }));
  }

  incrementCount() {
    this.store.dispatch(actions.incrementCount());
  }

  decrementCount() {
    this.store.dispatch(actions.decrementCount());
  }
}
