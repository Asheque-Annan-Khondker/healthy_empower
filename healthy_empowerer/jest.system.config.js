module.exports = {
  preset: "jest-expo",
  testMatch: ["**/*.test.[jt]s?(x)"],
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
