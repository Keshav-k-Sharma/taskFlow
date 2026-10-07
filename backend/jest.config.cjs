module.exports = {
  testEnvironment: "node",
  setupFiles: ["<rootDir>/tests/setup.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/resetLimiters.js"],
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  testTimeout: 15000,
  maxWorkers: 1,
};
