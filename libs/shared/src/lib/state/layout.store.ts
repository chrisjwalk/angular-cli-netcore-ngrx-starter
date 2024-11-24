import { computed, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  patchState,
  signalStore,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

export type LayoutState = {
  title: string;
  showSidenav: boolean;
  count: number;
};

export const layoutInitialState: LayoutState = {
  title: null,
  showSidenav: false,
  count: 10,
};

export function withLayoutFeature() {
  return signalStoreFeature(
    withState(layoutInitialState),

    withComputed(({ title }) => ({
      pageTitle: computed(() => `${title()}${title() ? ' | ' : ''}Demo App`),
    })),
    withMethods((store, titleService = inject(Title)) => ({
      setTitle(title: string) {
        patchState(store, { title });
        titleService.setTitle(store.pageTitle());
      },
      setShowSidenav(showSidenav: boolean) {
        patchState(store, { showSidenav });
      },
      openSidenav() {
        patchState(store, { showSidenav: true });
      },
      closeSidenav() {
        patchState(store, { showSidenav: false });
      },
      toggleSidenav() {
        patchState(store, (state) => ({
          ...state,
          showSidenav: !state.showSidenav,
        }));
      },
      setCount(count: number) {
        patchState(store, { count });
      },
    })),
  );
}

export const LayoutStore = signalStore(
  {
    providedIn: 'root',
  },
  withLayoutFeature(),
);
