/* global jest */
require('react-native-gesture-handler/jestSetup');
jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn(async () => false),
  isEnrolledAsync: jest.fn(async () => false),
  authenticateAsync: jest.fn(async () => ({success: false, error: 'user_cancel'})),
  cancelAuthenticate: jest.fn(async () => undefined),
}));
jest.mock('expo/virtual/env', () => ({env: process.env}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async () => null),
  setItemAsync: jest.fn(async () => undefined),
  deleteItemAsync: jest.fn(async () => undefined),
}));

jest.mock('@react-native-firebase/app', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));

jest.mock('@react-native-firebase/crashlytics', () => ({
  getCrashlytics: jest.fn(() => ({})),
  log: jest.fn(),
  recordError: jest.fn(),
  setAttributes: jest.fn(),
  crash: jest.fn(),
}));

jest.mock('expo-updates', () => ({
  isEnabled: false,
  checkForUpdateAsync: jest.fn(async () => ({isAvailable: false})),
  fetchUpdateAsync: jest.fn(async () => ({})),
  reloadAsync: jest.fn(async () => undefined),
}));

jest.mock('@react-native-community/geolocation', () => ({
  requestAuthorization: jest.fn(),
  getCurrentPosition: jest.fn(),
}));

jest.mock('react-native-vision-camera', () => {
  const Camera = () => null;

  Camera.getCameraPermissionStatus = jest.fn(() => 'granted');
  Camera.requestCameraPermission = jest.fn(async () => 'granted');

  return {
    Camera,
    useCameraDevice: jest.fn(() => ({id: 'back'})),
    useCodeScanner: jest.fn(config => config),
  };
});
