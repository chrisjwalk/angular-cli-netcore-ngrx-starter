import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  effect,
  inject,
} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import {
  LayoutStore,
  MainToolbarComponent,
  SidenavComponent,
  SidenavListItemComponent,
  SwUpdateStore,
} from '@myorg/shared';

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
  template: `
    <lib-main-toolbar
      (toggleSidenav)="layoutStore.toggleSidenav()"
    ></lib-main-toolbar>
    <mat-sidenav-container class="mat-app-background" fullscreen>
      <mat-sidenav
        mode="over"
        [opened]="layoutStore.showSidenav()"
        (openedChange)="sidenavChanged($event)"
        class="mat-app-background"
      >
        <lib-sidenav
          (toggleSidenav)="layoutStore.toggleSidenav()"
          (closeSidenav)="layoutStore.closeSidenav()"
        ></lib-sidenav>
      </mat-sidenav>
      <div class="app-content">
        <router-outlet></router-outlet>
      </div>
    </mat-sidenav-container>
  `,
  styles: `
    .mat-drawer-container {
      margin-top: var(--mat-toolbar-standard-height);
      height: calc(100% - var(--mat-toolbar-standard-height));
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SwUpdateStore],
})
export class AppComponent {
  layoutStore = inject(LayoutStore);
  swUpdateStore = inject(SwUpdateStore);

  updateReady = effect(() => {
    if (this.swUpdateStore.updateReady()) {
      this.swUpdateStore.openReloadAppSnackbar();
    }
  });

  @HostBinding('attr.data-testid') get testId() {
    return 'app-root';
  }

  sidenavChanged(sidenavOpened: boolean) {
    if (sidenavOpened) {
      this.layoutStore.openSidenav();
    } else {
      this.layoutStore.closeSidenav();
    }
  }
}
