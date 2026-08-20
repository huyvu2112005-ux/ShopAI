import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

type ThemeMode = 'light' | 'dark';

type ThemeContextType = {
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<ThemeMode>('light');

  const toggleTheme = () => {
    setMode(previousMode =>
      previousMode === 'light'
        ? 'dark'
        : 'light',
    );
  };

  const value = useMemo(
    () => ({
      mode,
      isDark: mode === 'dark',
      toggleTheme,
    }),
    [mode],
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