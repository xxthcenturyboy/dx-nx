const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  transformIgnorePatterns: [
    'node_modules/(?!' +
      [
        'mui-one-time-password-input'
      ].join('|') +
    ')'
  ],
  setupFiles: ['jest-canvas-mock'],
  globals: {
    webAppEnvVars: {}
  }
};
