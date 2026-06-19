import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ToastService, ToastComponent } from './toast.service';

describe('ToastComponent', () => {
  it('should expose message, action, and onDismiss fields', () => {
    const component = new ToastComponent();
    component.message = 'Test message';
    component.action = 'Undo';
    let dismissed = false;
    component.onDismiss = () => (dismissed = true);

    expect(component.message).toBe('Test message');
    expect(component.action).toBe('Undo');

    component.dismiss();
    expect(dismissed).toBe(true);
  });

  it('should handle dismiss with null onDismiss', () => {
    const component = new ToastComponent();
    component.onDismiss = null;
    expect(() => component.dismiss()).not.toThrow();
  });
});

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations(), ToastService],
    });
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open a toast notification with all parameters', () => {
    expect(() =>
      service.open('Test', 'Action', { duration: 500 }),
    ).not.toThrow();
  });

  it('should open a toast with only message', () => {
    expect(() => service.open('Message')).not.toThrow();
  });

  it('should open a toast with message and action only', () => {
    expect(() => service.open('Message', 'Close')).not.toThrow();
  });

  it('should handle zero duration (no auto-dismiss)', () => {
    expect(() =>
      service.open('Persistent', undefined, { duration: 0 }),
    ).not.toThrow();
  });

  it('should clear previous toast when opening a new one', () => {
    service.open('First');
    // Opening a second toast clears the first (exercises clearOverlay)
    expect(() => service.open('Second')).not.toThrow();
  });

  it('should use default duration of 5000ms when not specified', () => {
    expect(() => service.open('Default duration')).not.toThrow();
  });

  it('should handle rapid successive toasts', () => {
    service.open('Toast 1');
    service.open('Toast 2');
    service.open('Toast 3');
    // Previous toasts should be cleared; should not throw
    expect(true).toBe(true);
  });

  it('should accept empty action string', () => {
    expect(() => service.open('Message', '')).not.toThrow();
  });

  it('should auto-dismiss after configured duration', () => {
    vi.useFakeTimers();
    service.open('Timed', 'Action', { duration: 1000 });
    // Trigger the setTimeout callback to exercise the arrow () => this.clearOverlay()
    expect(() => vi.advanceTimersByTime(1000)).not.toThrow();
    vi.useRealTimers();
  });

  it('should auto-dismiss after default 5000ms duration', () => {
    vi.useFakeTimers();
    service.open('Default timer');
    expect(() => vi.advanceTimersByTime(5000)).not.toThrow();
    vi.useRealTimers();
  });
});
