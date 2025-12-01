import '@analogjs/vitest-angular/setup-snapshots';

import { provideZonelessChangeDetection, NgModule } from '@angular/core';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { getTestBed } from '@angular/core/testing';

@NgModule({
  providers: [provideZonelessChangeDetection()],
})
export class ZonelessTestModule {}

if (!(globalThis as any).__testEnvironmentInitialized) {
  getTestBed().initTestEnvironment(
    [BrowserDynamicTestingModule, ZonelessTestModule],
    platformBrowserDynamicTesting(),
  );
  (globalThis as any).__testEnvironmentInitialized = true;
}
