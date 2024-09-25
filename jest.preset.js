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
  globals: {
    webAppEnvVars: {}
  }
};
