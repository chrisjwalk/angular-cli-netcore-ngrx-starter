import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-vitest-example',
  template: ``,
  styles: `
    .app-main-toolbar {
      height: var(--mat-toolbar-standard-height);

      .logo {
        height: var(--mat-toolbar-standard-height);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VitestExampleComponent {}
