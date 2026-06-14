import { Injectable, Injector, inject } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, ChangeDetectionStrategy } from '@angular/core';

/** Configuration for a toast notification. */
export interface ToastConfig {
  /** Duration in ms before auto-dismiss. 0 = no auto-dismiss. */
  duration: number;
}

@Component({
  selector: 'lib-toast',
  template: `
    <div
      class="flex items-center gap-3 px-4 py-3 rounded-lg bg-inverse-surface text-inverse-on-surface shadow-lg"
      role="status"
    >
      <span class="text-sm font-medium flex-1">{{ message }}</span>
      @if (action) {
        <button
          class="text-sm font-semibold text-primary uppercase tracking-wide hover:opacity-80 bg-transparent border-0 cursor-pointer"
          (click)="dismiss()"
        >
          {{ action }}
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  message = '';
  action = '';
  private onDismiss: (() => void) | null = null;

  dismiss(): void {
    this.onDismiss?.();
  }
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly overlay = inject(Overlay);
  private readonly injector = inject(Injector);

  private overlayRef: OverlayRef | null = null;
  private dismissTimer: ReturnType<typeof setTimeout> | null = null;

  open(message: string, action?: string, config?: Partial<ToastConfig>): void {
    this.clearOverlay();

    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .global()
        .bottom('24px')
        .centerHorizontally(),
    });

    const portal = new ComponentPortal(ToastComponent, null, this.injector);
    const ref = this.overlayRef.attach(portal);
    ref.instance.message = message;
    ref.instance.action = action ?? '';
    ref.instance.onDismiss = () => this.clearOverlay();

    const duration = config?.duration ?? 5000;
    if (duration > 0) {
      this.dismissTimer = setTimeout(() => this.clearOverlay(), duration);
    }
  }

  private clearOverlay(): void {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }
}
