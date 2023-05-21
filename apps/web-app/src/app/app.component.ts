import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { map, of, tap } from 'rxjs';

import { MainToolbarComponent } from './core/components/main-toolbar/main-toolbar.component';
import { SidenavListItemComponent } from './core/components/sidenav-list-item/sidenav-list-item.component';
import { SidenavComponent } from './core/components/sidenav/sidenav.component';
import { LayoutFacade } from './core/store/facades';

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
export class AppComponent {
  layoutFacade = inject(LayoutFacade);

  private swUpdate = inject(SwUpdate);
  private snackBar = inject(MatSnackBar);

  updateReady$ = this.swUpdate.isEnabled
    ? this.swUpdate.versionUpdates.pipe(
        map((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        tap((updateReady) =>
          updateReady
            ? this.snackBar
                .open(`App update avalable! Reload?`, 'OK', {
                  duration: 15000,
                })
                .onAction()
                .subscribe(() =>
                  this.swUpdate
                    .activateUpdate()
                    .then(() => document.location.reload()),
                )
            : null,
        ),
      )
    : of(false);

  sidenavChanged(sidenavOpened: boolean) {
    if (sidenavOpened) {
      this.layoutFacade.openSidenav();
    } else {
      this.layoutFacade.closeSidenav();
    }
  }
}
