module.exports = {
  "env": {
    "node": true,
    "es6": true,
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "parser": "babel-eslint",
  },
  "rules": {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
};
