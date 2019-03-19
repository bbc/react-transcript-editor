module.exports = {
  parser: "babel-eslint",
  plugins: ["react", "css-modules", "prettier"],
  extends: ["plugin:react/recommended", "plugin:css-modules/recommended"],
  env: {
    node: true,
    browser: true,
    jest: true
  },
  rules: {
    "no-unused-expressions": "error",
    "no-trailing-spaces": "error",
    "no-nested-ternary": "error",
    "space-infix-ops": "error",
    "no-multiple-empty-lines": [2, { max: 1, maxEOF: 0, maxBOF: 0 }],
    "no-use-before-define": [2, { functions: false }],
    "prefer-const": 1,
    "react/prop-types": [1],
    "react/no-array-index-key": [1],
    "no-console": 0,
    "no-undef": [1],
    "no-case-declarations": [1],
    "no-return-assign": [1],
    "no-param-reassign": [1],
    "no-shadow": [1],
    "no-underscore-dangle": [0, "always"],
    "keyword-spacing": ["error", { before: true, after: true }],
    "key-spacing": ["error", { afterColon: true }],
    "newline-before-return": "error",
    "space-before-blocks": "error",
    "no-unused-vars": "error",
    "no-multi-spaces": "warn"
  },
  settings: {
    react: {
      version: "detect"
    }
  }
};
