import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatIcon } from '@angular/material/icon';
import {
  AppNotification,
  NotificationKind,
  NotificationStore,
} from '../state/notification.store';

const KIND_ICON: Record<NotificationKind, string> = {
  'sw-update': 'system_update',
  auth: 'account_circle',
  error: 'error_outline',
  info: 'notifications',
};

@Component({
  imports: [DatePipe, MatButton, MatIcon, MatIconButton],
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
          <button mat-button (click)="store.markAllRead()">
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
            <mat-icon class="shrink-0 mt-0.5 text-on-surface-variant">
              {{ iconFor(n.kind) }}
            </mat-icon>

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
                <button mat-button color="primary" (click)="runAction(n)">
                  {{ n.action.label }}
                </button>
              }
              <button
                mat-icon-button
                (click)="store.dismiss(n.id)"
                [attr.aria-label]="'Dismiss: ' + n.title"
              >
                <mat-icon>close</mat-icon>
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
})
export class NotificationList {
  readonly store = inject(NotificationStore);

  // MAT_BOTTOM_SHEET_DATA is optional — component works both in overlay and bottom sheet
  readonly bottomSheetData = inject(MAT_BOTTOM_SHEET_DATA, { optional: true });

  iconFor(kind: NotificationKind): string {
    return KIND_ICON[kind] ?? 'notifications';
  }

  runAction(n: AppNotification): void {
    n.action?.handler();
    this.store.markRead(n.id);
  }
}
