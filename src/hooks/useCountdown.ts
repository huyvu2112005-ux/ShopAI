import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

export default function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (seconds > 0) {
      setIsRunning(true);
    }
  }, [seconds]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    clearTimer();
    setSeconds(initialSeconds);
  }, [clearTimer, initialSeconds]);

  useEffect(() => {
    clearTimer();

    if (!isRunning || seconds <= 0) {
      return;
    }

    timerRef.current = setInterval(() => {
      setSeconds(previousSeconds => {
        if (previousSeconds <= 1) {
          setIsRunning(false);
          return 0;
        }

        return previousSeconds - 1;
      });
    }, 1000);

    return clearTimer;
  }, [
    clearTimer,
    isRunning,
    seconds,
  ]);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  return {
    seconds,
    isRunning,
    start,
    pause,
    reset,
  };
}