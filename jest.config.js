module.exports = {
  preset: 'jest-expo', // or 'ts-jest' if TypeScript
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(sequelize|pg|other-esm-packages)/)',
  ],
};
