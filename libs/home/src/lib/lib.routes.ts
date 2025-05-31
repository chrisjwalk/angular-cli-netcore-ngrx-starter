import { Route } from '@angular/router';
import { provideMarkdown } from 'ngx-markdown';

import { Home } from './home/home';

export const homeRoutes: Route[] = [
  {
    path: '',
    component: Home,
    providers: [provideMarkdown()],
  },
];
