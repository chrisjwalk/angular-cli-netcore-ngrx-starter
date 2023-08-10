import { Injectable, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { SignalStore } from './signal-store';

export interface LayoutState {
  title: string;
  showSidenav: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LayoutStore extends SignalStore<LayoutState> {
  private titleService = inject(Title);

  constructor() {
    super({ title: '', showSidenav: false });
  }

  readonly title = this.select((state) => state?.title);
  readonly showSidenav = this.select((state) => state?.showSidenav);

  readonly titleChanged = effect(() =>
    this.titleService.setTitle(this.title() + ' | Demo App'),
  );

  readonly setTitle = (title: string) => this.patchState({ title });
  readonly openSidenav = () => this.patchState({ showSidenav: true });
  readonly closeSidenav = () => this.patchState({ showSidenav: false });

  readonly toggleSidenav = this.updater((state) => ({
    ...state,
    showSidenav: !state.showSidenav,
  }));
}
