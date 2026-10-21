import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS, DARK_COLORS, ThemeColors} from '../constants/theme';

type ThemeMode = 'light' | 'dark';

type ThemeContextType = {
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
};

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, dispatch] = useReducer((state: ThemeMode, action: {type: 'toggle'} | {type: 'set'; mode: ThemeMode}): ThemeMode =>
    action.type === 'toggle' ? (state === 'light' ? 'dark' : 'light') : action.mode, 'light');
  const changed = useRef(false);
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem('shopai-theme').then(saved => {
      if (active && !changed.current && (saved === 'light' || saved === 'dark')) {dispatch({type: 'set', mode: saved});}
    }).catch(() => undefined);
    return () => {active = false;};
  }, []);
  const toggleTheme = useCallback(() => {changed.current = true; dispatch({type: 'toggle'});}, []);
  useEffect(() => {
    if (changed.current) {AsyncStorage.setItem('shopai-theme', mode).catch(() => undefined);}
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      isDark: mode === 'dark',
      toggleTheme,
      colors: mode === 'dark' ? DARK_COLORS : COLORS,
    }),
    [mode, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useThemeMode phải được sử dụng bên trong ThemeProvider.',
    );
  }

  return context;
}

export function useThemeColors(): ThemeColors {
  return useContext(ThemeContext)?.colors ?? COLORS;
}
