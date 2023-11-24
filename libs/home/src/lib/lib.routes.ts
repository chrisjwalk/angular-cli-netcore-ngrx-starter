import { Route } from '@angular/router';
import { provideMarkdown } from 'ngx-markdown';

import { HomeComponent } from './home/home.component';

export const homeRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
    providers: [provideMarkdown()],
  },
];
