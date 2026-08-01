const playwright = require('eslint-plugin-playwright');
const baseConfig = require('../../eslint.config.cjs');

module.exports = [
  playwright.configs['flat/recommended'],

  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.js'],
    // Override or add rules here
    rules: {
      // Newly enabled by eslint-plugin-playwright v2.11.0; was not enforced before the upgrade.
      'playwright/no-unnecessary-assertions': 'off',
    },
  },
];
