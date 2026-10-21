import React, {memo} from 'react';
import {
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';

import Typography from '@components/ui/Typography';

import {
  SIZES,
} from '@constants/theme';
import {useThemeColors} from '../../contexts/ThemeContext';

type ShopButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  variant?: 'primary' | 'secondary' | 'outline';
  accessibilityLabel?: string;
  testID?: string;
};

export function ShopButton({
  title,
  onPress,
  loading = false,
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  variant = 'primary',
  accessibilityLabel,
  testID,
}: ShopButtonProps) {
  const COLORS = useThemeColors();
  const busy = loading || isLoading;
  const isDisabled = disabled || busy;
  const foreground = variant === 'primary' ? COLORS.onPrimary : COLORS.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{disabled: isDisabled, busy}}
      testID={testID}
      disabled={isDisabled}
      onPress={onPress}
      style={({pressed}) => [
        styles.button,
        {backgroundColor: variant === 'primary' ? COLORS.primary : variant === 'secondary' ? COLORS.primarySoft : 'transparent', borderColor: variant === 'outline' ? COLORS.primary : 'transparent'},
        pressed && !isDisabled
          ? styles.pressed
          : null,
        isDisabled
          ? styles.disabled
          : null,
        style,
      ]}>
      {busy ? (
        <ActivityIndicator
          color={foreground}
          size="small"
        />
      ) : (
        <Typography
          variant="body1"
          color={foreground}
          style={[styles.text, textStyle]}>
          {title}
        </Typography>
      )}
    </Pressable>
  );
}

export default memo(ShopButton);

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: SIZES.radius,
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
