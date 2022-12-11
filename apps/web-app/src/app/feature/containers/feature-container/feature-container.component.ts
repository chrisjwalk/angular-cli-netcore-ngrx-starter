import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PageContainerComponent } from '@myorg/common';
import { PageToolbarComponent } from '@myorg/common/page-toolbar';
import { PageToolbarButtonComponent } from '@myorg/common/page-toolbar-button';

import { LayoutFacade } from '../../../core/store/facades';
import { FeatureComponentComponent } from '../../components/feature-component/feature-component.component';
import { FeatureFacade } from '../../store/facades';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    PageContainerComponent,
    PageToolbarComponent,
    PageToolbarButtonComponent,
    FeatureComponentComponent,
  ],
  selector: 'app-feature-container',
  templateUrl: './feature-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureContainerComponent implements OnInit {
  constructor(
    public featureFacade: FeatureFacade,
    public layoutFacade: LayoutFacade,
  ) {}

  ngOnInit() {
    this.layoutFacade.setTitle('Lazy Loaded Feature');
  }
}
