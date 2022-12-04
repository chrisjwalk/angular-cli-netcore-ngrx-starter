import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './core/containers/home/home.component';
import { ForecastsGuard } from './weather-forecast/guards/weather-forecast.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'feature',
    loadComponent: () =>
      import(
        './feature/containers/feature-container/feature-container.component'
      ).then((m) => m.FeatureContainerComponent),
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
