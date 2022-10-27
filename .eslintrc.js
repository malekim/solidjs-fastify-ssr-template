module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true
  },
  extends: ['standard-with-typescript', 'plugin:solid/typescript'],
  overrides: [
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', "solid"],
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  ignorePatterns: ['.eslintrc.js', '**/*.config.js', 'node_modules/', 'dist/'],
  rules: {
    'object-shorthand': 'off',
    'brace-style': 'off',
    '@typescript-eslint/brace-style': 'off',
    'indent': 'off',
    '@typescript-eslint/indent': 'off'
  }
}
