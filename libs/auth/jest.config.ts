/* eslint-disable */
export default {
  displayName: 'auth',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/libs/auth',
  coverageReporters: ['text', 'cobertura'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'junit/libs/auth',
        outputName: `TESTS-${Date.now()}.xml`,
      },
    ],
  ],
};
