module.exports = [
  {
    files: ["**/*.js", "**/*.cjs"],
    ignores: ["node_modules/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        process: "readonly", console: "readonly", Buffer: "readonly", URL: "readonly", __dirname: "readonly",
        setInterval: "readonly", clearInterval: "readonly",
        describe: "readonly", test: "readonly", expect: "readonly",
        beforeAll: "readonly", afterAll: "readonly", beforeEach: "readonly", jest: "readonly",
      },
    },
    rules: { "no-unused-vars": ["error", { argsIgnorePattern: "^_" }], "no-undef": "error" },
  },
];
