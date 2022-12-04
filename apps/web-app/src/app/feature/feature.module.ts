import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { reducers } from './store/reducers';

@NgModule({
  imports: [
    StoreModule.forFeature('lazyFeature', reducers),
    EffectsModule.forFeature([]),
  ],
})
export class FeatureModule {}
