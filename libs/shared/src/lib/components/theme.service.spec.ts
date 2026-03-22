import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let htmlElement: HTMLElement;

  function createService(): ThemeService {
    TestBed.configureTestingModule({});
    const svc = TestBed.inject(ThemeService);
    htmlElement = TestBed.inject(DOCUMENT).documentElement;
    return svc;
  }

  beforeEach(() => {
    localStorage.clear();
    htmlElement?.removeAttribute('data-theme');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    service = createService();
    expect(service).toBeTruthy();
  });

  it('defaults to "system" when localStorage is empty', () => {
    service = createService();
    expect(service.theme()).toBe('system');
    expect(htmlElement.hasAttribute('data-theme')).toBe(false);
  });

  it('reads stored theme from localStorage on init', () => {
    localStorage.setItem('theme', 'dark');
    service = createService();
    expect(service.theme()).toBe('dark');
    expect(htmlElement.getAttribute('data-theme')).toBe('dark');
  });

  it('falls back to "system" for invalid localStorage values', () => {
    localStorage.setItem('theme', 'invalid');
    service = createService();
    expect(service.theme()).toBe('system');
  });

  it('setTheme("dark") sets data-theme attribute, updates signal and localStorage', () => {
    service = createService();
    service.setTheme('dark');
    expect(htmlElement.getAttribute('data-theme')).toBe('dark');
    expect(service.theme()).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('setTheme("light") sets data-theme attribute', () => {
    service = createService();
    service.setTheme('light');
    expect(htmlElement.getAttribute('data-theme')).toBe('light');
    expect(service.theme()).toBe('light');
  });

  it('setTheme("system") removes data-theme attribute', () => {
    service = createService();
    service.setTheme('dark');
    service.setTheme('system');
    expect(htmlElement.hasAttribute('data-theme')).toBe(false);
    expect(service.theme()).toBe('system');
  });

  it('toggle() cycles system → light → dark → system', () => {
    service = createService();
    expect(service.theme()).toBe('system');

    service.toggle();
    expect(service.theme()).toBe('light');

    service.toggle();
    expect(service.theme()).toBe('dark');

    service.toggle();
    expect(service.theme()).toBe('system');
  });
});
