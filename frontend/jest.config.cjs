const nextJest = require("next/jest");
module.exports = nextJest({ dir: "./" })({
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  testMatch: ["<rootDir>/tests/**/*.test.js"],
});
