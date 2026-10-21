import {Platform} from 'react-native';

export type AppEnv = 'development' | 'staging' | 'production';

const configuredEnv = process.env.APP_ENV;
const fallbackEnv: AppEnv = __DEV__ ? 'development' : 'production';
const validEnvs: AppEnv[] = ['development', 'staging', 'production'];

export const APP_ENV: AppEnv = validEnvs.includes(configuredEnv as AppEnv)
  ? (configuredEnv as AppEnv)
  : fallbackEnv;

const developmentApi = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

// Expo replaces EXPO_PUBLIC_* variables in both native builds and OTA bundles.
const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
export const API_BASE_URL = (configuredApiUrl || (APP_ENV === 'development' ? developmentApi : '')).replace(/\/+$/, '');
if (!/^https?:\/\//.test(API_BASE_URL)) {
  throw new Error('Configure EXPO_PUBLIC_API_URL with an absolute HTTP(S) backend URL');
}
if (APP_ENV !== 'development' && !API_BASE_URL.startsWith('https://')) {
  throw new Error('Staging and production require an HTTPS backend URL');
}
export const ENABLE_CRASHLYTICS = process.env.FIREBASE_CONFIGURED === 'true';
export const ENABLE_CRASH_TEST = __DEV__ && APP_ENV !== 'production' && ENABLE_CRASHLYTICS;
export const ENABLE_OTA_UPDATE = !__DEV__;
export const APP_VERSION = '1.1.0';
