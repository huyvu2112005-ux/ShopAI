import {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {ThemeColors} from '../constants/theme';
import {useThemeColors} from '../contexts/ThemeContext';

export function useThemedStyles<T extends StyleSheet.NamedStyles<T>>(factory: (colors: ThemeColors) => T) {
  const colors = useThemeColors();
  const styles = useMemo(() => factory(colors), [colors, factory]);
  return {colors, styles};
}
