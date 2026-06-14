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
import {
  LucideAngularModule,
  Bell,
} from 'lucide-angular';
import { HlmButton } from '@myorg/spartan';
import { NotificationStore } from '../state/notification.store';
import { NotificationList } from './notification-list';

@Component({
  imports: [LucideAngularModule, HlmButton],
  selector: 'lib-notification-bell',
  template: `
    <button
      hlmButton
      variant="ghost"
      size="icon"
      class="relative"
      [attr.aria-label]="ariaLabel()"
      (click)="open()"
    >
      <lucide-icon [name]="bellIcon" class="h-5 w-5" />
      @if (store.unreadCount() > 0) {
        <span
          class="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold leading-none text-on-error bg-error rounded-full"
        >
          {{ store.unreadCount() }}
        </span>
      }
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-testid': 'lib-notification-bell',
  },
})
export class NotificationBell {
  readonly store = inject(NotificationStore);
  readonly bellIcon = Bell;

  private readonly injector = inject(Injector);
  private readonly overlay = inject(Overlay);
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

  open(): void {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      // On mobile, use a simple overlay anchored to the bottom
      this.toggleOverlay(true);
    } else {
      this.toggleOverlay(false);
    }
  }

  private toggleOverlay(isMobile: boolean): void {
    if (this.overlayRef?.hasAttached()) {
      this.store.markAllRead();
      this.overlayRef.detach();
      return;
    }

    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        hasBackdrop: true,
        backdropClass: 'cdk-overlay-transparent-backdrop',
        width: isMobile ? '100%' : '380px',
        positionStrategy: isMobile
          ? this.overlay.position().global().bottom('0').centerHorizontally()
          : this.overlay.position().global().right('16px').top('56px'),
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
