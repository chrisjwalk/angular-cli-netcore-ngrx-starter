import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { MainToolbarComponent } from '../../components/main-toolbar/main-toolbar.component';
import { SidenavListItemComponent } from '../../components/sidenav-list-item/sidenav-list-item.component';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';
import * as layoutActions from '../../store/actions';
import * as fromRoot from '../../store/reducers';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    SidenavComponent,
    MainToolbarComponent,
    SidenavListItemComponent,
    MatSnackBarModule,
  ],
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
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.showSidenav$ = this.store.pipe(select(fromRoot.getShowSidenav));
    this.title$ = this.store.pipe(select(fromRoot.getTitle));
    this.checkForSwUpdate();
  }

  openSidenav() {
    this.store.dispatch(layoutActions.openSidenav());
  }

  closeSidenav() {
    this.store.dispatch(layoutActions.closeSidenav());
  }

  toggleSidenav() {
    this.store.dispatch(layoutActions.toggleSidenav());
  }

  sidenavChanged(sidenavOpened: boolean) {
    if (sidenavOpened) {
      this.openSidenav();
    } else {
      this.closeSidenav();
    }
  }

  checkForSwUpdate() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe(() => {
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
    }
  }
}
