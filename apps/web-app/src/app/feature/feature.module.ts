import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../shared';
import { MaterialModule } from '../shared/material';
import { FeatureComponentComponent } from './components/feature-component/feature-component.component';
import { FeatureContainerComponent } from './containers/feature-container/feature-container.component';
import { reducers } from './store/reducers';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: FeatureContainerComponent }]),
    StoreModule.forFeature('lazyFeature', reducers),
    EffectsModule.forFeature([]),
  ],
  declarations: [FeatureContainerComponent, FeatureComponentComponent],
})
export class FeatureModule {}
