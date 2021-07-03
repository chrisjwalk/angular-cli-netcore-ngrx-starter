import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';

import { SharedModule } from '../shared';
import { MaterialModule } from '../shared/material';
import { MainToolbarComponent } from './components/main-toolbar/main-toolbar.component';
import { SidenavListItemComponent } from './components/sidenav-list-item/sidenav-list-item.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { AppComponent } from './containers/app/app.component';
import { HomeComponent } from './containers/home/home.component';
import { HttpInterceptorService } from './services';

export const COMPONENTS = [
  AppComponent,
  HomeComponent,
  MainToolbarComponent,
  SidenavComponent,
  SidenavListItemComponent,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    MarkdownModule.forRoot(),
    SharedModule,
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only',
      );
    }
  }
}
