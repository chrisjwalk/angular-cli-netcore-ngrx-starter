import { defineConfig } from 'vite';

export default defineConfig({
  root: import.meta.dirname,
  test: {
    watch: false,
    environment: 'node',
    include: ['dotnet.test.ts'],
    testTimeout: 60_000,
  },
});
