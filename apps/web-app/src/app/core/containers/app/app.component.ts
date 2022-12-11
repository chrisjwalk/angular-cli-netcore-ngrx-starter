import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

import { MainToolbarComponent } from '../../components/main-toolbar/main-toolbar.component';
import { SidenavListItemComponent } from '../../components/sidenav-list-item/sidenav-list-item.component';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';
import { LayoutFacade } from '../../store/facades';

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
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(
    public layoutFacade: LayoutFacade,
    private swUpdate: SwUpdate,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.checkForSwUpdate();
  }

  sidenavChanged(sidenavOpened: boolean) {
    if (sidenavOpened) {
      this.layoutFacade.openSidenav();
    } else {
      this.layoutFacade.closeSidenav();
    }
  }

  checkForSwUpdate() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(
          filter(
            (evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY',
          ),
        )
        .subscribe(() =>
          this.snackBar
            .open(`App update avalable! Reload?`, 'OK', {
              duration: 15000,
            })
            .onAction()
            .subscribe(() =>
              this.swUpdate
                .activateUpdate()
                .then(() => document.location.reload()),
            ),
        );
    }
  }
}
