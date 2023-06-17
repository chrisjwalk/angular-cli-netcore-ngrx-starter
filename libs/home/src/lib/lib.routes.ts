import { importProvidersFrom } from '@angular/core';
import { Route } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';

import { HomeComponent } from './home/home.component';

export const homeRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
    providers: [importProvidersFrom(MarkdownModule.forRoot())],
  },
];
