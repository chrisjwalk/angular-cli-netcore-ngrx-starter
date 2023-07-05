import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';

export interface LayoutState {
  title: string;
  showSidenav: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private titleService = inject(Title);

  private state = signal<LayoutState>({
    title: '',
    showSidenav: false,
  });

  title = computed(() => this.state().title);
  showSidenav = computed(() => this.state().showSidenav);

  constructor() {
    effect(() => {
      this.titleService.setTitle(this.title() + ' | Demo App');
    });
  }

  setTitle(title: string) {
    this.state.update((state) => ({ ...state, title }));
  }

  openSidenav() {
    this.state.update((state) => ({ ...state, showSidenav: true }));
  }

  closeSidenav() {
    this.state.update((state) => ({ ...state, showSidenav: false }));
  }

  toggleSidenav() {
    this.state.update((state) => ({
      ...state,
      showSidenav: !state.showSidenav,
    }));
  }
}
