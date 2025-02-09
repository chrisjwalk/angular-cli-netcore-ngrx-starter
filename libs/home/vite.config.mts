import { defineConfig, UserConfig } from 'vite';

import { baseConfig } from '../../vite.config.mjs';

const name = 'weather-forecast';

export default defineConfig({
  ...baseConfig,
  root: __dirname,
  test: {
    ...baseConfig.test,
    outputFile: {
      junit: `${baseConfig.root}/junit/libs/${name}/TESTS-${Date.now()}.xml`,
    },
    coverage: {
      ...baseConfig.test.coverage,
      reportsDirectory: `${baseConfig.root}/coverage/libs/${name}`,
    },
  },
} as UserConfig);
