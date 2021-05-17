module.exports = {
  preset: 'ts-jest',
  clearMocks: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/bundle'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/bundle'],
};
