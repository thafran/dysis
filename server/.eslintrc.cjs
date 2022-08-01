module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './server/tsconfig.json',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-async-promise-executor': 'off',
    'no-console': 'off',
    'class-methods-use-this': 'off',
    quotes: ['error', 'single'],
    'import/no-unresolved': 'off',
    'import/extensions': ['error', 'always', { ignorePackages: true }],
  },
};
