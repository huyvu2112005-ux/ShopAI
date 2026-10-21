import {useCallback, useEffect, useRef, useState} from 'react';
import {AppState} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import {APP_LOCK_TIMEOUT_MS} from '../constants/security';

export function useAppLock(token: string | null, timeout = APP_LOCK_TIMEOUT_MS) {
  const [locked, setLocked] = useState(!!token);
  const [checking, setChecking] = useState(!!token);
  const [error, setError] = useState('');
  const supported = useRef(false);
  const busy = useRef<number | null>(null);
  const validatedToken = useRef<string | null>(null);
  const currentToken = useRef(token);
  const revision = useRef(0);
  const backgroundAt = useRef<number | null>(null);
  currentToken.current = token;

  const unlock = useCallback(async () => {
    if (busy.current !== null || !currentToken.current) {return;}
    const requestRevision = revision.current;
    busy.current = requestRevision;
    setChecking(true);
    setError('');
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Mở khóa ShopAI', cancelLabel: 'Hủy',
        disableDeviceFallback: true, fallbackLabel: 'Đăng nhập bằng mật khẩu',
      });
      if (revision.current !== requestRevision) {return;}
      setLocked(!result.success);
      if (result.success) {validatedToken.current = currentToken.current;}
      if (!result.success) {setError('Chưa xác thực được. Bạn có thể thử lại hoặc đăng nhập bằng mật khẩu.');}
    } catch {
      if (revision.current === requestRevision) {setLocked(true); setError('Không mở được sinh trắc học. Vui lòng thử lại hoặc đăng nhập bằng mật khẩu.');}
    } finally {
      if (busy.current === requestRevision) {busy.current = null;}
      if (revision.current === requestRevision) {setChecking(false);}
    }
  }, []);

  useEffect(() => {
    const ownRevision = ++revision.current;
    busy.current = null;
    validatedToken.current = null;
    supported.current = false;
    backgroundAt.current = null;
    setLocked(!!token);
    setChecking(!!token);
    setError('');
    if (!token) {return;}
    (async () => {
      try {
        const available = await LocalAuthentication.hasHardwareAsync() && await LocalAuthentication.isEnrolledAsync();
        if (revision.current !== ownRevision) {return;}
        supported.current = available;
        if (!available) {validatedToken.current = token; setLocked(false); setChecking(false); return;}
        await unlock();
      } catch {
        if (revision.current === ownRevision) {setChecking(false); setError('Không kiểm tra được sinh trắc học. Hãy đăng nhập bằng mật khẩu.');}
      }
    })();
    return () => {revision.current = ownRevision + 1; LocalAuthentication.cancelAuthenticate().catch(() => undefined);};
  }, [token, unlock]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (!currentToken.current || busy.current !== null) {return;}
      if (state === 'background') {backgroundAt.current = Date.now();}
      if (state === 'active' && backgroundAt.current !== null) {
        const elapsed = Date.now() - backgroundAt.current;
        backgroundAt.current = null;
        if (supported.current && elapsed >= timeout) {setLocked(true); unlock();}
      }
    });
    return () => subscription.remove();
  }, [timeout, unlock]);

  return {locked: !!token && (validatedToken.current !== token || locked), checking, error, unlock};
}
