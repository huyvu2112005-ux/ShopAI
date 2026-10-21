module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [{
    files: ['scripts/**/*.cjs'],
    env: {node: true},
    parserOptions: {ecmaVersion: 2022, sourceType: 'script'},
  }],
  ignorePatterns: ['shopai-backend/**', '.sprint9-check/**', '.sprint10-check/**', '.sprint11-check/**', 'coverage/**', 'artifacts/**'],
};
