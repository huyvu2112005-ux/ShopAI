import React from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
} from 'react-native';

import Typography from '@components/ui/Typography';

import {
  COLORS,
  SIZES,
} from '@constants/theme';

type ShopInputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export default function ShopInput({
  label,
  error,
  style,
  ...props
}: ShopInputProps) {
  return (
    <View style={styles.container}>
      {label ? (
        <Typography
          variant="body2"
          style={styles.label}>
          {label}
        </Typography>
      ) : null}

      <TextInput
        {...props}
        style={[
          styles.input,
          error ? styles.inputError : null,
          style,
        ]}
        placeholderTextColor={COLORS.textLight}
      />

      {error ? (
        <Typography
          variant="small"
          color={COLORS.error}
          style={styles.error}>
          {error}
        </Typography>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },

  label: {
    marginBottom: 6,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    color: COLORS.text,
    fontSize: SIZES.body1,
  },

  inputError: {
    borderColor: COLORS.error,
  },

  error: {
    marginTop: 6,
  },
});