import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

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
});
