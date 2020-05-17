import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from 'app/core/containers/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'feature',
    loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule),
  },
  {
    path: 'weather-forecast',
    loadChildren: () => import('./weather-forecast/weather-forecast.module').then(m => m.WeatherForecastModule),
  },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
