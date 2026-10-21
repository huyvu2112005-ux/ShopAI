import React from 'react';
import Renderer, {act} from 'react-test-renderer';
import {AppState, AppStateStatus} from 'react-native';
import * as Biometrics from 'expo-local-authentication';
import {useAppLock} from '../src/hooks/useAppLock';

let result: ReturnType<typeof useAppLock>;
let listener: (state: AppStateStatus) => void;
let tree: Renderer.ReactTestRenderer;
function Probe({token}: {token: string | null}) {
  result = useAppLock(token);
  return null;
}
beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(AppState, 'addEventListener').mockImplementation((_event, callback) => {
    listener = callback;
    return {remove: jest.fn()};
  });
  (Biometrics.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
  (Biometrics.isEnrolledAsync as jest.Mock).mockResolvedValue(true);
  (Biometrics.authenticateAsync as jest.Mock).mockResolvedValue({success: true});
});
afterEach(async () => {
  if (tree) {await act(async () => tree.unmount());}
  jest.restoreAllMocks();
});
async function mount(token: string | null = 'token') {
  await act(async () => {tree = Renderer.create(<Probe token={token} />);});
}
test('unsupported devices enter without being trapped behind biometrics', async () => {
  (Biometrics.hasHardwareAsync as jest.Mock).mockResolvedValue(false);
  await mount();
  expect(result.locked).toBe(false);
  expect(Biometrics.authenticateAsync).not.toHaveBeenCalled();
});
test('cancellation keeps private content locked and a successful retry opens it', async () => {
  (Biometrics.authenticateAsync as jest.Mock).mockResolvedValueOnce({success: false, error: 'user_cancel'});
  await mount();
  expect(result.locked).toBe(true);
  expect(result.error).toBeTruthy();
  await act(async () => {await result.unlock();});
  expect(result.locked).toBe(false);
});
test('returning before two minutes stays open; returning at the timeout authenticates again', async () => {
  let now = 1000;
  jest.spyOn(Date, 'now').mockImplementation(() => now);
  await mount();
  await act(async () => {listener('background'); now += 119999; listener('active');});
  expect(Biometrics.authenticateAsync).toHaveBeenCalledTimes(1);
  (Biometrics.authenticateAsync as jest.Mock).mockResolvedValueOnce({success: false});
  await act(async () => {listener('background'); now += 120000; listener('active');});
  expect(Biometrics.authenticateAsync).toHaveBeenCalledTimes(2);
  expect(result.locked).toBe(true);
});
test('late authentication from a previous account cannot unlock the next account', async () => {
  let complete!: (value: {success: boolean}) => void;
  (Biometrics.authenticateAsync as jest.Mock).mockImplementationOnce(() => new Promise(resolve => {complete = resolve;}));
  await mount('old');
  (Biometrics.authenticateAsync as jest.Mock).mockResolvedValueOnce({success: false});
  await act(async () => {tree.update(<Probe token="new" />);});
  await act(async () => {complete({success: true});});
  expect(result.locked).toBe(true);
});
