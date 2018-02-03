module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  transformIgnorePatterns: ['node_modules'],
  transform: {
    '^.+\\.ts$': '<rootDir>/jest.preprocessor.js',
  },
  testMatch: ['**/src/**/*.spec.ts'],
};
