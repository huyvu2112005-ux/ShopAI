import React, {useEffect, useMemo} from 'react';
import {ActivityIndicator, StatusBar, StyleSheet, View} from 'react-native';
import {createNavigationContainerRef, DarkTheme, DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import * as Updates from 'expo-updates';
import {store} from './src/store/redux/store';
import {ThemeProvider, useThemeMode} from './src/contexts/ThemeContext';
import AppLockGate from './src/components/AppLockGate';
import AuthStackNavigator from './src/navigation/AuthStackNavigator';
import MainDrawerNavigator from './src/navigation/MainDrawerNavigator';
import {linking} from './src/navigation/linking';
import {useAuthStore} from './src/store/useAuthStore';
import {AppDrawerParamList} from './src/types/navigationTypes';
import {APP_VERSION, ENABLE_OTA_UPDATE} from './src/constants/env';
import {addCrashBreadcrumb, recordNonFatal, setCrashContext} from './src/services/crashReporting';

const navigationRef = createNavigationContainerRef<AppDrawerParamList>();
function trackScreen() {
  const screen = navigationRef.getCurrentRoute()?.name;
  if (screen) {setCrashContext({screen}); addCrashBreadcrumb(`Navigation: ${screen}`);}
}
function AppNavigation({ready, signedIn}: {ready: boolean; signedIn: boolean}) {
  const {isDark, colors} = useThemeMode();
  const base = isDark ? DarkTheme : DefaultTheme;
  const theme = useMemo(() => ({...base, colors: {...base.colors, primary: colors.primary, background: colors.background, card: colors.surface, text: colors.text, border: colors.border, notification: colors.primary}}), [base, colors]);
  return <>
    <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
    {!ready ? <View style={[styles.loading, {backgroundColor: colors.background}]}><ActivityIndicator accessibilityLabel="Đang khôi phục phiên đăng nhập" color={colors.primary} /></View> :
      <NavigationContainer key={signedIn ? 'private' : 'public'} ref={navigationRef} theme={theme} linking={linking} onReady={trackScreen} onStateChange={trackScreen}>
        {signedIn ? <MainDrawerNavigator /> : <AuthStackNavigator />}
      </NavigationContainer>}
  </>;
}
export default function App(): React.JSX.Element {
  const userToken = useAuthStore(state => state.token);
  const hasHydrated = useAuthStore(state => state.hasHydrated);
  const initializeAuth = useAuthStore(state => state.initialize);
  const queryClient = useMemo(() => new QueryClient({defaultOptions: {queries: {enabled: userToken !== null}}}), [userToken]);
  useEffect(() => {initializeAuth().then(() => undefined);}, [initializeAuth]);
  useEffect(() => {
    setCrashContext({app_version: APP_VERSION, update_id: Updates.updateId ?? 'embedded'});
    addCrashBreadcrumb('App ShopAI khởi động');
  }, []);
  useEffect(() => {
    if (__DEV__ || !ENABLE_OTA_UPDATE || !Updates.isEnabled) {return;}
    (async () => {
      try {
        addCrashBreadcrumb('OTA: kiểm tra bản cập nhật');
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          addCrashBreadcrumb('OTA: downloaded; apply on next launch');
        }
      } catch (error) {recordNonFatal(error, 'EASUpdateCheckFailed');}
    })();
  }, []);
  return <GestureHandlerRootView style={styles.fill}>
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ThemeProvider>
            <AppLockGate><AppNavigation ready={hasHydrated} signedIn={userToken !== null} /></AppLockGate>
          </ThemeProvider>
        </Provider>
      </QueryClientProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView>;
}
const styles = StyleSheet.create({fill: {flex: 1}, loading: {flex: 1, alignItems: 'center', justifyContent: 'center'}});
