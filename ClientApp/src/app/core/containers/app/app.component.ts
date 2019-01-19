import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SwUpdate } from '@angular/service-worker';
import { select, Store } from '@ngrx/store';
import * as layoutActions from 'app/core/store/actions';
import * as fromRoot from 'app/core/store/reducers';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showSidenav$: Observable<boolean>;
  title$: Observable<string>;
  constructor(
    private store: Store<fromRoot.State>,
    private swUpdate: SwUpdate,
    public snackBar: MatSnackBar,
  ) {
    this.showSidenav$ = this.store.pipe(select(fromRoot.getShowSidenav));
    this.title$ = this.store.pipe(select(fromRoot.getTitle));
  }
  ngOnInit(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe((event) => {
        console.log('current version is', event.current);
        console.log('available version is', event.available);
        const message = `App update avalable! Reload?`;
        this.snackBar
          .open(message, 'OK', {
            duration: 15000,
          })
          .onAction()
          .subscribe(() => {
            this.swUpdate
              .activateUpdate()
              .then(() => document.location.reload());
          });
      });
      this.swUpdate.activated.subscribe((event) => {
        console.log('old version was', event.previous);
        console.log('new version is', event.current);
      });
    }
  }
  openSidenav() {
    this.store.dispatch(new layoutActions.OpenSidenav());
  }
  closeSidenav() {
    this.store.dispatch(new layoutActions.CloseSidenav());
  }
  toggleSidenav() {
    this.store.dispatch(new layoutActions.ToggleSidenav());
  }
  sidenavChanged(sidenavOpened) {
    if (sidenavOpened) {
      this.openSidenav();
    } else {
      this.closeSidenav();
    }
  }
}
