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
};
