import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';

import { HomeComponent } from './core/containers/home/home.component';
import { ForecastsGuard } from './weather-forecast/guards/weather-forecast.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/containers/home/home.component').then(
        (m) => m.HomeComponent,
      ),
    providers: [importProvidersFrom(MarkdownModule.forRoot())],
  },
  {
    path: 'feature',
    loadComponent: () =>
      import(
        './feature/containers/feature-container/feature-container.component'
      ).then((m) => m.FeatureContainerComponent),
    providers: [],
  },
  {
    path: 'weather-forecast',
    loadComponent: () =>
      import(
        './weather-forecast/containers/fetch-data/fetch-data.component'
      ).then((m) => m.FetchDataComponent),
    canActivate: [ForecastsGuard],
  },
  { path: '**', component: HomeComponent },
];
