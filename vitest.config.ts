import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Run each test file in an isolated environment to avoid TestBed
    // state leaking between files in the same worker/process.
    isolate: true,
    // Keep threads enabled for parallelism but isolation ensures clean state.
    threads: true,
    // Ensure the Angular TestBed environment is initialized before tests run.
    // This runs `libs/shared/src/test-setup.shared.ts` which calls
    // `getTestBed().initTestEnvironment(...)` so any imports that use
    // Angular's `inject()` don't instantiate the test module early.
    setupFiles: ['./libs/shared/src/test-setup.shared.ts'],
  },
});
