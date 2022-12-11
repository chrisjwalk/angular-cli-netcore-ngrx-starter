import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import * as actions from '../actions';
import * as reducer from '../reducers';

@Injectable({ providedIn: 'root' })
export class LayoutFacade {
  title$ = this.store.pipe(select(reducer.getTitle));
  showSidenav$ = this.store.pipe(select(reducer.getShowSidenav));

  constructor(private store: Store<reducer.State>) {}

  setTitle(title: string) {
    this.store.dispatch(actions.setTitle({ title }));
  }
  openSidenav() {
    this.store.dispatch(actions.openSidenav());
  }

  closeSidenav() {
    this.store.dispatch(actions.closeSidenav());
  }

  toggleSidenav() {
    this.store.dispatch(actions.toggleSidenav());
  }
}
