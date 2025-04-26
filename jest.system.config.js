module.exports = {
  preset: "jest-expo",
  testMatch: ["**/__tests__/system/**/*.test.[jt]s?(x)"],
  verbose: true,
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "test-results",
        outputName: "junit.xml",
      },
    ],
  ],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    //'node_modules/(?!(sequelize|expo|react-native|other-esm-packages)/)',
    "node_modules/(?!(expo|react-native|@react-native|@expo|expo-router)/)",
  ],
};
