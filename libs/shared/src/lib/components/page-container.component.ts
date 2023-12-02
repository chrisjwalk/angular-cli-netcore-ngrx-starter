import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  standalone: true,
  selector: 'lib-page-container',
  template: ` <ng-content /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageContainerComponent {
  @HostBinding('class') class = 'flex p-4 flex-col';
}
