import {AxiosError, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import * as SecureStore from 'expo-secure-store';
import axiosClient from '../src/api/axiosClient';
import {useAuthStore} from '../src/store/useAuthStore';

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((yes, no) => {resolve = yes; reject = no;});
  return {promise, resolve, reject};
}
beforeEach(async () => {
  await useAuthStore.getState().logout();
  jest.clearAllMocks();
});

test('a delayed 401 from the old session cannot log out a newly logged in user', async () => {
  await useAuthStore.getState().login('old-token');
  const response = deferred<AxiosResponse>();
  const started = deferred<InternalAxiosRequestConfig>();
  const request = axiosClient.get('/api/orders', {adapter: config => {
    started.resolve(config);
    return response.promise;
  }});
  const outcome = request.catch(error => error);
  const config = await started.promise;
  await useAuthStore.getState().login('new-token');
  response.reject(new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, undefined, {data: {}, status: 401, statusText: 'Unauthorized', headers: {}, config}));
  expect(await outcome).toMatchObject({response: {status: 401}});
  expect(useAuthStore.getState().token).toBe('new-token');
});

test('401 for the active token clears the active session', async () => {
  await useAuthStore.getState().login('expired-token');
  await expect(axiosClient.get('/api/orders', {adapter: config => Promise.reject(new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, undefined, {data: {}, status: 401, statusText: 'Unauthorized', headers: {}, config}))})).rejects.toBeInstanceOf(AxiosError);
  expect(useAuthStore.getState().token).toBeNull();
});

test('slow logout storage cannot clear a subsequent login', async () => {
  await useAuthStore.getState().login('old-token');
  const deletion = deferred<void>();
  (SecureStore.deleteItemAsync as jest.Mock).mockReturnValueOnce(deletion.promise);
  const logout = useAuthStore.getState().logout();
  const login = useAuthStore.getState().login('new-token');
  deletion.resolve();
  await Promise.all([logout, login]);
  expect(useAuthStore.getState().token).toBe('new-token');
  expect(SecureStore.setItemAsync).toHaveBeenLastCalledWith('shopai-access-token', 'new-token');
});

test('hydration returning late cannot restore an old token over a new login', async () => {
  const storage = deferred<string | null>();
  (SecureStore.getItemAsync as jest.Mock).mockReturnValueOnce(storage.promise);
  const initialize = useAuthStore.getState().initialize();
  const login = useAuthStore.getState().login('new-token');
  storage.resolve('stale-token');
  await Promise.all([initialize, login]);
  expect(useAuthStore.getState().token).toBe('new-token');
});
