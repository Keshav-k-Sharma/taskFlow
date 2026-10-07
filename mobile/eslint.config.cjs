const expo = require("eslint-config-expo/flat");
module.exports = [
  ...expo,
  { ignores: ["dist/**", ".expo/**"] },
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      globals: {
        jest: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
      },
    },
  },
];
