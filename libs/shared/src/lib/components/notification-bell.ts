import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  DestroyRef,
  Injector,
  computed,
  inject,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NotificationStore } from '../state/notification.store';
import { NotificationList } from './notification-list';

@Component({
  imports: [MatBadgeModule, MatIcon, MatIconButton],
  selector: 'lib-notification-bell',
  template: `
    <button
      mat-icon-button
      [matBadge]="store.unreadCount()"
      [matBadgeHidden]="store.unreadCount() === 0"
      matBadgeColor="warn"
      matBadgeSize="small"
      [attr.aria-label]="ariaLabel()"
      (click)="open($event)"
    >
      <mat-icon>notifications</mat-icon>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationBell {
  readonly store = inject(NotificationStore);

  private readonly injector = inject(Injector);
  private readonly overlay = inject(Overlay);
  private readonly bottomSheet = inject(MatBottomSheet);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);

  private overlayRef: OverlayRef | null = null;
  private panelRef: ComponentRef<NotificationList> | null = null;

  readonly ariaLabel = computed(() => {
    const count = this.store.unreadCount();
    return count > 0
      ? `${count} unread notification${count === 1 ? '' : 's'}`
      : 'Notifications';
  });

  constructor() {
    this.destroyRef.onDestroy(() => this.overlayRef?.dispose());
  }

  open(event: MouseEvent): void {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      this.bottomSheet.open(NotificationList, { injector: this.injector });
    } else {
      this.toggleOverlay(event.currentTarget as HTMLElement);
    }
  }

  private toggleOverlay(anchor: HTMLElement): void {
    if (this.overlayRef?.hasAttached()) {
      this.store.markAllRead();
      this.overlayRef.detach();
      return;
    }

    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        hasBackdrop: true,
        backdropClass: 'cdk-overlay-transparent-backdrop',
        width: '320px',
        positionStrategy: this.overlay
          .position()
          .flexibleConnectedTo(anchor)
          .withPositions([
            {
              originX: 'end',
              originY: 'bottom',
              overlayX: 'end',
              overlayY: 'top',
              offsetY: 8,
            },
          ]),
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
      });

      this.overlayRef.backdropClick().subscribe(() => {
        this.store.markAllRead();
        this.overlayRef?.detach();
      });
    }

    this.panelRef = this.overlayRef.attach(
      new ComponentPortal(NotificationList, null, this.injector),
    );
  }
}
