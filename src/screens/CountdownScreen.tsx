import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import Typography from '@components/ui/Typography';
import ShopButton from '@components/ui/ShopButton';
import useCountdown from '@hooks/useCountdown';

import {
  COLORS,
  SIZES,
} from '@constants/theme';

export default function CountdownScreen() {
  const {
    seconds,
    isRunning,
    start,
    pause,
    reset,
  } = useCountdown(10);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Typography
          variant="h1"
          color={COLORS.primary}>
          Bộ đếm ngược
        </Typography>

        <Typography
          variant="body1"
          color={COLORS.textLight}
          style={styles.description}>
          Ví dụ sử dụng Custom Hook trong React Native
        </Typography>

        <View style={styles.counterBox}>
          <Typography
            variant="h1"
            color={COLORS.text}>
            {seconds}
          </Typography>

          <Typography
            variant="body2"
            color={COLORS.textLight}>
            giây
          </Typography>
        </View>

        <Typography
          variant="body2"
          color={
            isRunning
              ? COLORS.success
              : COLORS.textLight
          }
          style={styles.status}>
          {isRunning
            ? 'Đang đếm ngược'
            : 'Đang tạm dừng'}
        </Typography>

        <ShopButton
          title="Bắt đầu"
          onPress={start}
          disabled={isRunning || seconds === 0}
          style={styles.button}
        />

        <ShopButton
          title="Tạm dừng"
          onPress={pause}
          disabled={!isRunning}
          style={styles.button}
        />

        <ShopButton
          title="Đặt lại"
          onPress={reset}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    padding: SIZES.padding,
    justifyContent: 'center',
  },

  description: {
    marginTop: 8,
    marginBottom: 32,
  },

  counterBox: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
  },

  status: {
    textAlign: 'center',
    marginBottom: 24,
  },

  button: {
    marginBottom: 12,
  },
});