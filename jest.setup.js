/* global jest */

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
