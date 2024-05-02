module.exports = {
  root: true,
  extends: ["airbnb-base", "airbnb-typescript/base", "prettier"],
  env: {
    jest: true,
  },
  rules: {
    "import/no-extraneous-dependencies": "off",
    "no-underscore-dangle": "off",
    "import/prefer-default-export": "off",
    "require-await": "error",
    "no-plusplus": "off",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "variableLike",
        leadingUnderscore: "allow",
        format: ["camelCase", "PascalCase", "UPPER_CASE"],
      },
    ],
  },
  parserOptions: {
    project: "./tsconfig.eslint.json",
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      objectLiteralDuplicateProperties: false,
    },
  },
};
