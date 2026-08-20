import React from 'react';
import {
  Text,
  TextProps,
  TextStyle,
  StyleProp,
} from 'react-native';

import {
  COLORS,
  FONTS,
} from '@constants/theme';

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
  color = COLORS.text,
  style,
  children,
  ...props
}: TypographyProps) {
  return (
    <Text
      {...props}
      style={[
        FONTS[variant],
        {
          color,
        },
        style,
      ]}>
      {children}
    </Text>
  );
}