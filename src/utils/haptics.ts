import {Platform, Vibration} from 'react-native';

let hapticsEnabled = true;

export const setHapticsEnabled = (value: boolean) => {
  hapticsEnabled = value;
};

const safeVibrate = (pattern: number | number[]) => {
  if (!hapticsEnabled) {
    return;
  }

  try {
    Vibration.vibrate(pattern);
  } catch (error) {
    console.log('[haptics] Vibration is not available:', error);
  }
};

export const hapticLight = () => safeVibrate(20);

export const hapticMedium = () => safeVibrate(40);

export const hapticSuccess = () => {
  if (Platform.OS === 'ios') {
    safeVibrate(1);
    return;
  }

  safeVibrate([0, 30, 60, 30]);
};

export const hapticError = () => safeVibrate([0, 60, 80, 60, 80, 60]);
