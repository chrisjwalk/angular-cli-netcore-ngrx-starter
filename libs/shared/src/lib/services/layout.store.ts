import { Injectable, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { patchState, signalStore, withState } from '@ngrx/signals';

export type LayoutState = {
  title: string;
  showSidenav: boolean;
};

const LayoutSignalStore = signalStore(
  withState<LayoutState>({ title: '', showSidenav: false }),
);

@Injectable({
  providedIn: 'root',
})
export class LayoutStore {
  private store = new LayoutSignalStore();
  private titleService = inject(Title);

  readonly title = this.store.title;
  readonly showSidenav = this.store.showSidenav;

  readonly titleChanged = effect(() =>
    this.titleService.setTitle(
      `${this.title()}${this.title() ? ' | ' : ''}Demo App`,
    ),
  );

  readonly setTitle = (title: string) => patchState(this.store, { title });
  readonly openSidenav = () => patchState(this.store, { showSidenav: true });
  readonly closeSidenav = () => patchState(this.store, { showSidenav: false });
  readonly toggleSidenav = () =>
    patchState(this.store, (state) => ({
      ...state,
      showSidenav: !state.showSidenav,
    }));
}
