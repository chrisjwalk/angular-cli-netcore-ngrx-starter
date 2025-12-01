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

// Try to initialize the Angular testing environment. In CI the test runner
// can run suites in different orders or workers; catch and ignore the
// "already initialized" error to avoid spurious failures when the
// environment was set up elsewhere in the same process.
try {
  if (!(globalThis as any).__testEnvironmentInitialized) {
    getTestBed().initTestEnvironment(
      [BrowserDynamicTestingModule, ZonelessTestModule],
      platformBrowserDynamicTesting(),
    );
    (globalThis as any).__testEnvironmentInitialized = true;
  }
} catch (e: any) {
  const msg = (e && e.message) || String(e);
  // Known benign message when initTestEnvironment is called multiple times.
  if (
    msg.includes(
      'Cannot set base providers because it has already been called',
    ) ||
    msg.includes('Test module has already been instantiated') ||
    msg.includes('has already been called')
  ) {
    // ignore
  } else {
    // Re-throw unexpected errors so real problems surface.
    throw e;
  }
}
