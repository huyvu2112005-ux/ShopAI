export const COLORS = {
  primary: '#FF4D4F',
  secondary: '#FF4D4F',

  background: '#F5F5F5',
  surface: '#FFFFFF',

  text: '#2C3E50',
  textLight: '#7F8C8D',

  border: '#E8E8E8',

  error: '#FF0000',
  success: '#52C41A',
  onPrimary: '#FFFFFF',
  primarySoft: '#FFF0F1',
  successSoft: '#F0FBF4',
  warningSoft: '#FFF8E8',
  mutedSurface: '#F7F8FA',
};

export const DARK_COLORS = {
  ...COLORS,
  background: '#121212',
  surface: '#1E1E1E',

  text: '#FFFFFF',
  textLight: '#B0B0B0',

  border: '#333333',
  primarySoft: '#351F2B',
  successSoft: '#162D24',
  warningSoft: '#352C1A',
  mutedSurface: '#252A32',
};

export type ThemeColors = typeof COLORS;

export const SIZES = {
  base: 8,
  font: 14,
  radius: 12,
  padding: 16,

  h1: 24,
  h2: 20,
  h3: 18,

  body1: 16,
  body2: 14,
  small: 12,
};

export const FONTS = {
  h1: {
    fontSize: SIZES.h1,
    fontWeight: '700' as const,
  },

  h2: {
    fontSize: SIZES.h2,
    fontWeight: '700' as const,
  },

  h3: {
    fontSize: SIZES.h3,
    fontWeight: '600' as const,
  },

  body1: {
    fontSize: SIZES.body1,
    fontWeight: '400' as const,
  },

  body2: {
    fontSize: SIZES.body2,
    fontWeight: '400' as const,
  },

  small: {
    fontSize: SIZES.small,
    fontWeight: '400' as const,
  },
};
