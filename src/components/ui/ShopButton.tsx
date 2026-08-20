import React from 'react';
import {
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
} from 'react-native';

import Typography from '@components/ui/Typography';

import {
  COLORS,
  SIZES,
} from '@constants/theme';

type ShopButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function ShopButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
}: ShopButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      style={({pressed}) => [
        styles.button,
        pressed && !isDisabled
          ? styles.pressed
          : null,
        isDisabled
          ? styles.disabled
          : null,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          color={COLORS.surface}
          size="small"
        />
      ) : (
        <Typography
          variant="body1"
          color={COLORS.surface}
          style={styles.text}>
          {title}
        </Typography>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  pressed: {
    opacity: 0.8,
  },

  disabled: {
    opacity: 0.5,
  },

  text: {
    fontWeight: '700',
  },
});