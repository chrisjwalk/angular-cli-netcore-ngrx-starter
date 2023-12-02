import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  computed,
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
import { getState } from '@ngrx/signals';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    MatSidenavModule,
    SidenavComponent,
    MainToolbarComponent,
    SidenavListItemComponent,
    MatSnackBarModule,
  ],
  selector: 'app-root',
  template: `
    @if (vm(); as vm) {
      <lib-main-toolbar (toggleSidenav)="store.toggleSidenav()" />
      <mat-sidenav-container fullscreen>
        <mat-sidenav
          mode="over"
          [opened]="vm.showSidenav"
          (openedChange)="store.setShowSidenav($event)"
        >
          <lib-sidenav
            (toggleSidenav)="store.toggleSidenav()"
            (closeSidenav)="store.closeSidenav()"
          />
        </mat-sidenav>
        <router-outlet />
      </mat-sidenav-container>
    }
  `,
  styles: [
    `
      .mat-drawer-container {
        margin-top: var(--mat-toolbar-standard-height);
        height: calc(100% - var(--mat-toolbar-standard-height));
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SwUpdateStore],
})
export class AppComponent {
  private swUpdateStore = inject(SwUpdateStore);

  store = inject(LayoutStore);
  vm = computed(() => ({
    ...getState(this.store),
  }));

  updateReady = effect(() => {
    if (this.swUpdateStore.updateReady()) {
      this.swUpdateStore.openReloadAppSnackbar();
    }
  });

  @HostBinding('attr.data-testid') testid = 'app-root';
}
