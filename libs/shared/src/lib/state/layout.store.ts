import { inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

import {
  patchState,
  signalStore,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';

export type LayoutState = {
  title: string;
  showSidenav: boolean;
};

export const layoutInitialState: LayoutState = {
  title: null,
  showSidenav: false,
};

export function withLayoutFeature() {
  return signalStoreFeature(
    withState(layoutInitialState),
    withMethods((store) => {
      const titleService = inject(Title);

      return {
        setTitle: (title: string) => {
          titleService.setTitle(`${title}${title ? ' | ' : ''}Demo App`);
          patchState(store, { title });
        },
        setShowSidenav: (showSidenav: boolean) =>
          patchState(store, { showSidenav }),
        openSidenav: () => patchState(store, { showSidenav: true }),
        closeSidenav: () => patchState(store, { showSidenav: false }),
        toggleSidenav: () =>
          patchState(store, (state) => ({
            ...state,
            showSidenav: !state.showSidenav,
          })),
      };
    }),
  );
}

export const LayoutStore = signalStore(
  {
    providedIn: 'root',
  },
  withLayoutFeature(),
);
