const { FlatCompat } = require('@eslint/eslintrc');
const baseConfig = require('../../../eslint.config.js');
const js = require('@eslint/js');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...baseConfig,
  ...compat.config().map((config) => ({
    ...config,
    files: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.js', 'src/**/*.jsx'],
    ignores: ['dist/**'],
    rules: {
      ...config.rules,
    },
  })),
];
