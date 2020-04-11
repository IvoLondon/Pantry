module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: [
    'react'
  ],
  rules: {
    "one-var": ["error", "consecutive"],
    "indent": ["warn", 4, {"SwitchCase": 1}],
    "no-debugger": "error",
    "array-callback-return": "warn",
    "semi": ["error", "always"],
    "semi-spacing": ["error", {"before": false, "after": true}],
    "no-shadow": "error",
    "camelcase": "warn",
    "quotes": [ "warn", "single" ],
    "object-curly-spacing": ["error", "always"],
    "space-before-function-paren": ["error", {"anonymous": "always", "named": "never", "asyncArrow": "always"}],
    "no-multiple-empty-lines": ["error", { "max": 2, "maxBOF": 1, "maxEOF": 1}],
    "react/jsx-uses-react": "warn",
    "react/jsx-uses-vars": "warn",
  }
}
