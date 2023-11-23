import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export type LayoutState = {
  title: string;
  showSidenav: boolean;
};

const LayoutSignalStore = signalStore(
  withState<LayoutState>({ title: '', showSidenav: false }),
  withMethods((store) => {
    const titleService = inject(Title);

    const setTitle = (title: string) => {
      titleService.setTitle(`${title}${title ? ' | ' : ''}Demo App`);
      patchState(store, { title });
    };
    const openSidenav = () => patchState(store, { showSidenav: true });
    const closeSidenav = () => patchState(store, { showSidenav: false });
    const toggleSidenav = () =>
      patchState(store, (state) => ({
        ...state,
        showSidenav: !state.showSidenav,
      }));

    return { setTitle, openSidenav, closeSidenav, toggleSidenav };
  }),
);

@Injectable({
  providedIn: 'root',
})
export class LayoutStore {
  private store = new LayoutSignalStore();

  readonly title = this.store.title;
  readonly showSidenav = this.store.showSidenav;

  readonly setTitle = this.store.setTitle;
  readonly openSidenav = this.store.openSidenav;
  readonly closeSidenav = this.store.closeSidenav;
  readonly toggleSidenav = this.store.toggleSidenav;
}
