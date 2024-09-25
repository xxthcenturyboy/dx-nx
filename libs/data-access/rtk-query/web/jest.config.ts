/* eslint-disable */
export default {
  displayName: 'rtk-query-web',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'jsdom',
  transform: {
      '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
      '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  setupFiles: ['jest-canvas-mock'],
  coverageDirectory: '../../../../coverage/libs/data-access/rtk-query/web',
};
