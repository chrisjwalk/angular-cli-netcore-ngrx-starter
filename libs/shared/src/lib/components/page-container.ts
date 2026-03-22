import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-page-container',
  template: ` <ng-content /> `,
  host: {
    class: 'flex px-8 pb-8 flex-col w-full max-w-[1440px] mx-auto',
    'data-testid': 'lib-page-container',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageContainer {}
