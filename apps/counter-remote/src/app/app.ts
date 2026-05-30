import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  host: { 'data-testid': 'app-root' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
