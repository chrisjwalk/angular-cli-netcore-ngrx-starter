import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from 'app/core/containers/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'feature',
    loadChildren: './feature/feature.module#FeatureModule',
  },
  {
    path: 'forecasts',
    loadChildren: './forecasts/forecasts.module#ForecastsModule',
  },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
