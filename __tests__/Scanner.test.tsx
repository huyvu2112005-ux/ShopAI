import React from 'react';
import Renderer, {act} from 'react-test-renderer';
import {AppState, AppStateStatus, Platform, Vibration} from 'react-native';
import {Camera, useCodeScanner} from 'react-native-vision-camera';
import ScannerScreen from '../src/screens/ScannerScreen';
jest.mock('@react-navigation/native', () => ({...jest.requireActual('@react-navigation/native'), useIsFocused: () => true}));
let listener: (state: AppStateStatus) => void;
let tree: Renderer.ReactTestRenderer;
beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  jest.replaceProperty(Platform, 'OS', 'android');
  jest.spyOn(AppState, 'addEventListener').mockImplementation((_event, callback) => {listener = callback; return {remove: jest.fn()};});
  jest.spyOn(Vibration, 'vibrate').mockImplementation(() => {});
  (Camera.getCameraPermissionStatus as jest.Mock).mockReturnValue('granted');
});
afterEach(async () => {await act(async () => tree?.unmount()); jest.restoreAllMocks(); jest.useRealTimers();});
async function mount() {
  const navigation = {navigate: jest.fn(), goBack: jest.fn()};
  await act(async () => {tree = Renderer.create(<ScannerScreen navigation={navigation as any} route={{key: 'scanner', name: 'Scanner'} as any} />);});
  return navigation;
}
test('camera stops in background and resumes only when the app returns active', async () => {
  await mount();
  await act(async () => listener('background'));
  expect(tree.root.findByType(Camera).props.isActive).toBe(false);
  await act(async () => listener('active'));
  expect(tree.root.findByType(Camera).props.isActive).toBe(true);
});
test('repeated scanner frames produce one route change and one short vibration', async () => {
  const navigation = await mount();
  const scan = (useCodeScanner as jest.Mock).mock.calls.at(-1)[0].onCodeScanned;
  await act(async () => {scan([{value: '8936117530045'}]); scan([{value: '8936117530045'}]);});
  expect(navigation.navigate).toHaveBeenCalledTimes(1);
  expect(navigation.navigate).toHaveBeenCalledWith('Home', {scannedCode: '8936117530045'});
  expect(Vibration.vibrate).toHaveBeenCalledTimes(1);
  expect(Vibration.vibrate).toHaveBeenCalledWith(30);
});
