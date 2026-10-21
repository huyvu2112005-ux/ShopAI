import {
  crash,
  getCrashlytics,
  log,
  recordError as firebaseRecordError,
  setAttributes as firebaseSetAttributes,
} from '@react-native-firebase/crashlytics';
import {APP_ENV, API_BASE_URL, ENABLE_CRASHLYTICS, ENABLE_CRASH_TEST} from '../constants/env';

function safelyRun(action: () => unknown): void {
  if (!ENABLE_CRASHLYTICS) {
    return;
  }

  try {
    const result = action();
    if (result && typeof (result as Promise<unknown>).catch === 'function') {
      (result as Promise<unknown>).catch(() => undefined);
    }
  } catch {
    // Firebase project files are supplied per-app; telemetry must never break UI.
  }
}

export function addCrashBreadcrumb(message: string): void {
  safelyRun(() => log(getCrashlytics(), message));
}

export function setCrashContext(attributes: Record<string, string>): void {
  safelyRun(() =>
    firebaseSetAttributes(getCrashlytics(), {
      app_env: APP_ENV,
      api_base_url: API_BASE_URL,
      ...attributes,
    }),
  );
}

export function recordNonFatal(error: unknown, name: string): void {
  const normalized = error instanceof Error ? error : new Error(String(error));
  safelyRun(() => firebaseRecordError(getCrashlytics(), normalized, name));
}

export function triggerTestCrash(): void {
  if (!ENABLE_CRASH_TEST) {return;}
  safelyRun(() => crash(getCrashlytics()));
}
