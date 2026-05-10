import { defineConfig } from 'vitest/config';

const name = 'update-packages';

export default defineConfig({
  root: __dirname,
  resolve: { tsconfigPaths: true },
  test: {
    watch: false,
    globals: true,
    isolate: true,
    environment: 'node',
    include: ['src/**/*.spec.ts', 'src/**/*.spec.tsx'],
    reporters: ['default', 'junit'],
    outputFile: {
      junit: `../../junit/libs/${name}/TESTS-${Date.now()}.xml`,
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'cobertura'],
      reportsDirectory: `../../coverage/libs/${name}`,
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/components/Summary.tsx'],
    },
  },
});
