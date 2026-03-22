import { DOCUMENT } from '@angular/common';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';
const VALID_THEMES: Theme[] = ['light', 'dark', 'system'];
const THEME_CYCLE: Theme[] = ['system', 'light', 'dark'];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  readonly theme: WritableSignal<Theme>;

  constructor() {
    const initial = this.getStoredTheme();
    this.theme = signal<Theme>(initial);
    this.applyTheme(initial);
  }

  setTheme(theme: Theme) {
    this.applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    this.theme.set(theme);
  }

  /** Cycles: system → light → dark → system */
  toggle() {
    const next =
      THEME_CYCLE[(THEME_CYCLE.indexOf(this.theme()) + 1) % THEME_CYCLE.length];
    this.setTheme(next);
  }

  private applyTheme(theme: Theme) {
    if (theme === 'system') {
      this.document.documentElement.removeAttribute('data-theme');
    } else {
      this.document.documentElement.setAttribute('data-theme', theme);
    }
  }

  private getStoredTheme(): Theme {
    const stored = localStorage.getItem(STORAGE_KEY);
    return VALID_THEMES.includes(stored as Theme)
      ? (stored as Theme)
      : 'system';
  }
}
