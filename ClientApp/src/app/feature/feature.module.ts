import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from 'app/shared';
import { MaterialModule } from 'app/shared/material';
import { reducers } from './store/reducers';

import { FeatureContainerComponent } from './containers/feature-container/feature-container.component';
import { FeatureComponentComponent } from './components/feature-component/feature-component.component';

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
