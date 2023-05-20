import { Injectable, effect, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class LayoutFacade {
  title = signal<string>('');
  showSidenav = signal<boolean>(false);

  constructor(private titleService: Title) {
    effect(() => {
      this.titleService.setTitle(this.title() + ' | Demo App');
    });
  }

  setTitle(title: string) {
    this.title.set(title);
  }

  openSidenav() {
    this.showSidenav.set(true);
  }

  closeSidenav() {
    this.showSidenav.set(false);
  }

  toggleSidenav() {
    this.showSidenav.update((showSidenav) => !showSidenav);
  }
}
