import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as layoutActions from '../../store/actions';
import * as fromRoot from '../../store/reducers';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showSidenav$: Observable<boolean>;
  title$: Observable<string>;
  constructor(private store: Store<fromRoot.State>) {
    this.showSidenav$ = this.store.pipe(select(fromRoot.getShowSidenav));
    this.title$ = this.store.pipe(select(fromRoot.getTitle));
  }
  ngOnInit(): void {}
  openSidenav() {
    this.store.dispatch(layoutActions.openSidenav());
  }
  closeSidenav() {
    this.store.dispatch(layoutActions.closeSidenav());
  }
  toggleSidenav() {
    this.store.dispatch(layoutActions.toggleSidenav());
  }
  sidenavChanged(sidenavOpened) {
    if (sidenavOpened) {
      this.openSidenav();
    } else {
      this.closeSidenav();
    }
  }
}
