export default {
  testEnvironment: 'node',
  projects: [
    {
      displayName: 'backend',
      rootDir: './backend',
      testEnvironment: 'node',
      globals: {
        "__ENV__": "test"
      },
      transform: {},
      globalSetup: "<rootDir>/src/test/globalSetup.js",
      globalTeardown: "<rootDir>/src/test/globalTeardown.js",
      setupFilesAfterEnv: ["<rootDir>/src/test/setupFileAfterEnv.js"],
      testMatch: [
        "<rootDir>/src/**/*.test.js",
        "<rootDir>/src/__tests__/**/*.js"
      ]
    }
  ]
};