import React from 'react';
import {
  Text,
  TextProps,
  TextStyle,
  StyleProp,
} from 'react-native';

import {
  FONTS,
} from '@constants/theme';
import {useThemeColors} from '../../contexts/ThemeContext';

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body1'
  | 'body2'
  | 'small';

type TypographyProps = TextProps & {
  variant?: TypographyVariant;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export default function Typography({
  variant = 'body1',
  color,
  style,
  children,
  ...props
}: TypographyProps) {
  const colors = useThemeColors();
  return (
    <Text
      {...props}
      style={[
        FONTS[variant],
        {
          color: color ?? colors.text,
        },
        style,
      ]}>
      {children}
    </Text>
  );
}
