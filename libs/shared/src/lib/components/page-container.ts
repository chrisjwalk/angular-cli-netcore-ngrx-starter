import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-page-container',
  template: ` <ng-content /> `,
  host: {
    class: 'flex p-4 flex-col',
    'data-testid': 'lib-page-container',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageContainer {}
