import React, {
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  View,
  StyleSheet,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import Typography from '@components/ui/Typography';
import ShopButton from '@components/ui/ShopButton';

import {
  COLORS,
  SIZES,
} from '@constants/theme';

type ResultProps = {
  value: number;
  onReset: () => void;
};

const ResultBox = memo(
  ({value, onReset}: ResultProps) => {
    console.log('ResultBox render');

    return (
      <View style={styles.resultBox}>
        <Typography
          variant="h2"
          color={COLORS.text}>
          Kết quả: {value}
        </Typography>

        <ShopButton
          title="Đặt lại kết quả"
          onPress={onReset}
          style={styles.resetButton}
        />
      </View>
    );
  },
);

ResultBox.displayName = 'ResultBox';

export default function MemoDemoScreen() {
  const [number, setNumber] = useState(1);
  const [counter, setCounter] = useState(0);

  const calculatedValue = useMemo(() => {
    console.log('Đang tính toán lại...');

    return number * number;
  }, [number]);

  const handleReset = useCallback(() => {
    setNumber(1);
  }, []);

  const increaseNumber = useCallback(() => {
    setNumber(previous => previous + 1);
  }, []);

  const increaseCounter = useCallback(() => {
    setCounter(previous => previous + 1);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Typography
          variant="h1"
          color={COLORS.primary}>
          Tối ưu Re-render
        </Typography>

        <Typography
          variant="body1"
          color={COLORS.textLight}
          style={styles.description}>
          Ví dụ React.memo, useMemo và useCallback
        </Typography>

        <View style={styles.card}>
          <Typography variant="body1">
            Số hiện tại: {number}
          </Typography>

          <Typography
            variant="body2"
            color={COLORS.textLight}
            style={styles.spacing}>
            Bình phương của số: {calculatedValue}
          </Typography>

          <ShopButton
            title="Tăng số"
            onPress={increaseNumber}
            style={styles.button}
          />
        </View>

        <ResultBox
          value={calculatedValue}
          onReset={handleReset}
        />

        <View style={styles.card}>
          <Typography variant="body1">
            Bộ đếm riêng: {counter}
          </Typography>

          <Typography
            variant="body2"
            color={COLORS.textLight}
            style={styles.spacing}>
            Bộ đếm này dùng để tạo re-render ở component cha.
          </Typography>

          <ShopButton
            title="Tăng bộ đếm"
            onPress={increaseCounter}
            style={styles.button}
          />
        </View>
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
  },

  description: {
    marginTop: 8,
    marginBottom: 24,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 16,
  },

  resultBox: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 16,
  },

  spacing: {
    marginTop: 8,
  },

  button: {
    marginTop: 16,
  },

  resetButton: {
    marginTop: 16,
  },
});