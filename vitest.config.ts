import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Run each test file in an isolated environment to avoid TestBed
    // state leaking between files in the same worker/process.
    isolate: true,
    // Keep threads enabled for parallelism but isolation ensures clean state.
    threads: true,
  },
});
