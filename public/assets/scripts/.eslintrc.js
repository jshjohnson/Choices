// get polyfill settings from top level config
// @ts-ignore
const { settings } = require('../../../.eslintrc.json');

// Adding non-polyfilable Symbol-related functions as they are most probably
// behind the flag

settings.polyfills.push(
  'Symbol.toStringTag',
  'Symbol.for',
  'Object.getOwnPropertySymbols',
  'Object.getOwnPropertyDescriptors',
  'Promise', // Promise is gate checked
);

module.exports = /** @type {import('eslint').Linter.Config} */ ({
  root: true,
  extends: ['plugin:compat/recommended'],
  parserOptions: {
    // ensure that it's compatible with ES5 browsers, so, no `const`, etc
    ecmaVersion: 5,
  },
  env: {
    browser: true,
  },
  settings,
});
