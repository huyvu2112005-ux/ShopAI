import {crash, log, recordError, setAttributes} from '@react-native-firebase/crashlytics';
import {addCrashBreadcrumb, recordNonFatal, setCrashContext, triggerTestCrash} from '../src/services/crashReporting';
import {fetchProductsPage} from '../src/services/productQuery';
import axiosClient from '../src/api/axiosClient';

jest.mock('../src/constants/env', () => ({
  APP_ENV: 'staging', API_BASE_URL: 'https://example.com', ENABLE_CRASHLYTICS: true, ENABLE_CRASH_TEST: true,
}));
jest.mock('../src/api/axiosClient', () => ({__esModule: true, default: {get: jest.fn()}}));

beforeEach(() => jest.clearAllMocks());

test('Home records a non-fatal and context while preserving the API error', async () => {
  const error = new Error('offline');
  (axiosClient.get as jest.Mock).mockRejectedValueOnce(error);
  await expect(fetchProductsPage({})).rejects.toBe(error);
  expect(recordError).toHaveBeenCalledWith(expect.anything(), error, 'ProductFetchFailed');
  expect(setAttributes).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({screen: 'HomeScreen', app_env: 'staging'}));
  expect(log).toHaveBeenCalled();
});

test('telemetry failure cannot break shopping and crash test calls the native SDK', () => {
  (log as jest.Mock).mockImplementationOnce(() => {throw new Error('Firebase unavailable');});
  expect(() => addCrashBreadcrumb('Checkout started')).not.toThrow();
  setCrashContext({screen: 'CheckoutScreen', cart_item_count: '2'});
  recordNonFatal('checkout failed', 'CheckoutOrderFailed');
  expect(recordError).toHaveBeenCalledWith(expect.anything(), expect.any(Error), 'CheckoutOrderFailed');
  triggerTestCrash();
  expect(crash).toHaveBeenCalledTimes(1);
});

test('disabled crash test never invokes the native crash SDK', () => {
  const env = jest.requireMock('../src/constants/env');
  env.ENABLE_CRASH_TEST = false;
  try {
    triggerTestCrash();
    expect(crash).not.toHaveBeenCalled();
  } finally {
    env.ENABLE_CRASH_TEST = true;
  }
});
