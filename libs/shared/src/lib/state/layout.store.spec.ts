import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { LayoutStore, layoutInitialState } from './layout.store';

describe('LayoutStore', () => {
  let store: LayoutStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Title],
    });

    store = TestBed.inject(LayoutStore);
  });

  it('should be created', () => {
    expect(store).toBeDefined();
  });

  it('should set and compute title', () => {
    expect(store.pageTitle()).toBe('Demo App');
    store.setTitle('Test Page');
    expect(store.title()).toBe('Test Page');
    expect(store.pageTitle()).toBe('Test Page | Demo App');
  });

  it('should toggle sidenav', () => {
    expect(store.showSidenav()).toBe(layoutInitialState.showSidenav);

    store.openSidenav();
    expect(store.showSidenav()).toBe(true);

    store.closeSidenav();
    expect(store.showSidenav()).toBe(false);

    store.toggleSidenav();
    expect(store.showSidenav()).toBe(true);

    store.toggleSidenav();
    expect(store.showSidenav()).toBe(false);
  });

  it('should set count', () => {
    expect(store.count()).toBe(layoutInitialState.count);
    store.setCount(20);
    expect(store.count()).toBe(20);
  });
});
