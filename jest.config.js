module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '/shopai-backend/', '/.sprint11-check/'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/**/__tests__/**', '!src/types/**', '!src/constants/**'],
  coverageReporters: ['text', 'lcov', 'json-summary'],
  coverageThreshold: {global: {statements: 40, branches: 30, functions: 40, lines: 40}, './src/utils/': {statements: 90, branches: 80, functions: 90, lines: 90}, './src/store/': {statements: 70, branches: 60, functions: 70, lines: 70}},
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|@reduxjs|@shopify|@react-native-async-storage|react-redux|immer|redux|reselect|zustand|react-native-drawer-layout|react-native-gesture-handler|react-native-reanimated|react-native-worklets|react-native-vector-icons|react-native-safe-area-context)/)',
  ],
};
