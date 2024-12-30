module.exports = {
  //preset: 'jest-expo',
  preset: 'react-native',
  testMatch: ['**/components/__tests__/__integration__/**/*.test.[jt]s?(x)'], // Look for tests in the tests/integration folder
  testEnvironment: 'node',
  verbose: true,
    
};