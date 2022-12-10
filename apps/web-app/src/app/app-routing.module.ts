import { importProvidersFrom, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { MarkdownModule } from 'ngx-markdown';

import { HomeComponent } from './core/containers/home/home.component';
import { reducers } from './feature/store/reducers';
import { ForecastsGuard } from './weather-forecast/guards/weather-forecast.guard';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/containers/home/home.component').then(
        (m) => m.HomeComponent,
      ),
    providers: [
      importProvidersFrom(MarkdownModule.forRoot()),
    ],
  },
  {
    path: 'feature',
    loadComponent: () =>
      import(
        './feature/containers/feature-container/feature-container.component'
      ).then((m) => m.FeatureContainerComponent),
    providers: [
      importProvidersFrom(
        StoreModule.forFeature('lazyFeature', reducers),
        EffectsModule.forFeature([]),
      ),
    ],
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

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
