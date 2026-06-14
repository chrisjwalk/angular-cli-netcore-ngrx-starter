import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { X, Bell, AlertCircle, UserCircle, ArrowUpCircle, LucideAngularModule } from 'lucide-angular';
import { HlmButton } from '@myorg/spartan';
import {
  AppNotification,
  NotificationKind,
  NotificationStore,
} from '../state/notification.store';

const KIND_ICON: Record<NotificationKind, unknown> = {
  'sw-update': ArrowUpCircle,
  auth: UserCircle,
  error: AlertCircle,
  info: Bell,
};

@Component({
  imports: [DatePipe, HlmButton, LucideAngularModule],
  selector: 'lib-notification-list',
  template: `
    <div
      class="w-full max-h-[70vh] flex flex-col bg-surface-container-low text-on-surface shadow-2xl rounded overflow-hidden"
    >
      <div
        class="flex items-center justify-between px-4 py-2 border-b border-outline-variant"
      >
        <h2 class="text-base font-medium m-0">Notifications</h2>
        @if (store.unreadCount() > 0) {
          <button hlmButton variant="ghost" (click)="store.markAllRead()">
            Mark all read
          </button>
        }
      </div>

      <div class="overflow-y-auto flex-1">
        @for (n of store.notifications(); track n.id) {
          <div
            class="flex gap-3 p-3 border-b border-outline-variant/30 last:border-0"
            [class.border-l-4]="!n.read"
            [class.border-l-primary]="!n.read"
          >
            <lucide-icon
              [name]="iconFor(n.kind)"
              class="h-5 w-5 shrink-0 mt-0.5 text-on-surface-variant"
            />

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5">
                <p
                  class="text-sm m-0 leading-tight flex-1"
                  [class.font-semibold]="!n.read"
                >
                  {{ n.title }}
                </p>
                @if (!n.read) {
                  <span
                    class="w-2 h-2 rounded-full bg-primary shrink-0"
                    aria-label="Unread"
                  ></span>
                }
              </div>
              @if (n.detail) {
                <p class="text-xs text-on-surface-variant m-0 mt-0.5">
                  {{ n.detail }}
                </p>
              }
              <p class="text-xs text-on-surface-variant/70 m-0 mt-1">
                {{ n.createdAt | date: 'short' }}
              </p>
            </div>

            <div class="flex flex-col gap-1 shrink-0 items-end">
              @if (n.action) {
                <button
                  hlmButton
                  variant="ghost"
                  size="sm"
                  (click)="runAction(n)"
                >
                  {{ n.action.label }}
                </button>
              }
              <button
                hlmButton
                variant="ghost"
                size="icon"
                (click)="store.dismiss(n.id)"
                [attr.aria-label]="'Dismiss: ' + n.title"
              >
                <lucide-icon [name]="closeIcon" class="h-4 w-4" />
              </button>
            </div>
          </div>
        } @empty {
          <p
            class="text-sm text-on-surface-variant text-center py-8 m-0 min-h-[160px] flex items-center justify-center"
          >
            No notifications
          </p>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-testid': 'lib-notification-list',
  },
})
export class NotificationList {
  readonly store = inject(NotificationStore);
  readonly closeIcon = X;

  iconFor(kind: NotificationKind): unknown {
    return KIND_ICON[kind] ?? Bell;
  }

  runAction(n: AppNotification): void {
    n.action?.handler();
    this.store.markRead(n.id);
  }
}
