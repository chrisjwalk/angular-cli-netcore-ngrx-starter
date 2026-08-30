import { Route } from '@angular/router';

import { Recipe } from './recipe';
import { Recipes } from './recipes';

export const recipesRoutes: Route[] = [
  { path: '', component: Recipes },
  { path: ':slug', component: Recipe },
];
