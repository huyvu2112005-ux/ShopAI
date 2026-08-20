import React from 'react';
import {
  View,
  StyleSheet,
  Switch,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import Typography from '@components/ui/Typography';
import ShopButton from '@components/ui/ShopButton';

import {
  COLORS,
  DARK_COLORS,
  SIZES,
} from '@constants/theme';

import {
  useThemeMode,
} from '../contexts/ThemeContext';

export default function ThemeDemoScreen() {
  const {
    isDark,
    toggleTheme,
  } = useThemeMode();

  const backgroundColor = isDark
    ? DARK_COLORS.background
    : COLORS.background;

  const surfaceColor = isDark
    ? DARK_COLORS.surface
    : COLORS.surface;

  const textColor = isDark
    ? DARK_COLORS.text
    : COLORS.text;

  const secondaryTextColor = isDark
    ? DARK_COLORS.textLight
    : COLORS.textLight;

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {backgroundColor},
      ]}>
      <View style={styles.container}>
        <Typography
          variant="h1"
          color={textColor}>
          Chế độ giao diện
        </Typography>

        <Typography
          variant="body1"
          color={secondaryTextColor}
          style={styles.description}>
          Bạn có thể chuyển giữa giao diện sáng và tối.
        </Typography>

        <View
          style={[
            styles.card,
            {backgroundColor: surfaceColor},
          ]}>
          <Typography
            variant="h3"
            color={textColor}>
            Chế độ tối
          </Typography>

          <Switch
            value={isDark}
            onValueChange={toggleTheme}
          />
        </View>

        <Typography
          variant="body2"
          color={secondaryTextColor}
          style={styles.status}>
          Trạng thái hiện tại:{' '}
          {isDark
            ? 'Giao diện tối'
            : 'Giao diện sáng'}
        </Typography>

        <ShopButton
          title={
            isDark
              ? 'Chuyển sang giao diện sáng'
              : 'Chuyển sang giao diện tối'
          }
          onPress={toggleTheme}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    padding: SIZES.padding,
  },

  description: {
    marginTop: 8,
    marginBottom: 24,
  },

  card: {
    padding: 18,
    borderRadius: SIZES.radius,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  status: {
    marginTop: 20,
    textAlign: 'center',
  },

  button: {
    marginTop: 24,
  },
});