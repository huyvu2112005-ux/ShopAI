module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|@reduxjs|@shopify|@react-native-async-storage|react-redux|immer|redux|reselect|zustand|react-native-vector-icons|react-native-safe-area-context)/)',
  ],
};
