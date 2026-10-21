import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Switch, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import {useThemeMode} from '../contexts/ThemeContext';
import {useAuthStore} from '../store/useAuthStore';
import ShopButton from '../components/ui/ShopButton';
import {APP_VERSION} from '../constants/env';

export default function SettingsScreen() {
  const {colors, isDark, toggleTheme} = useThemeMode();
  const logout = useAuthStore(state => state.logout);
  const [biometric, setBiometric] = useState('Đang kiểm tra...');
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const ready = await LocalAuthentication.hasHardwareAsync() && await LocalAuthentication.isEnrolledAsync();
        if (active) {setBiometric(ready ? 'Sẵn sàng. Khóa lại sau 2 phút ở nền.' : 'Thiết bị chưa đăng ký sinh trắc học. Bạn vẫn có thể dùng mật khẩu.');}
      } catch {if (active) {setBiometric('Không kiểm tra được. Bạn vẫn có thể dùng mật khẩu.');}}
    })();
    return () => {active = false;};
  }, []);
  return <SafeAreaView style={[styles.fill, {backgroundColor: colors.background}]} edges={['bottom']}>
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={[styles.title, {color: colors.text}]}>Cài đặt ShopAI</Text>
      <View style={[styles.card, {backgroundColor: colors.surface}]}>
        <View style={styles.row}><Text style={[styles.heading, {color: colors.text}]}>Giao diện tối</Text><Switch accessibilityLabel="Giao diện tối" value={isDark} onValueChange={toggleTheme} /></View>
        <Text style={[styles.description, {color: colors.textLight}]}>Áp dụng cho trang chủ, sản phẩm, giỏ hàng, đơn hàng và trợ lý AI.</Text>
      </View>
      <View style={[styles.card, {backgroundColor: colors.surface}]}>
        <Text style={[styles.heading, {color: colors.text}]}>Bảo vệ tài khoản</Text>
        <Text style={[styles.description, {color: colors.textLight}]}>{biometric}</Text>
        <Text style={[styles.description, {color: colors.textLight}]}>Phiên đăng nhập được lưu an toàn trên thiết bị. Bạn luôn có thể đăng xuất để đăng nhập lại bằng mật khẩu.</Text>
      </View>
      <ShopButton title="Đăng xuất" variant="outline" onPress={() => {logout();}} />
      <Text style={[styles.version, {color: colors.textLight}]}>ShopAI v{APP_VERSION}</Text>
    </ScrollView>
  </SafeAreaView>;
}
const styles = StyleSheet.create({fill: {flex: 1}, content: {padding: 20, gap: 18}, title: {fontSize: 26, fontWeight: '800'}, card: {padding: 18, borderRadius: 16}, row: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, heading: {fontSize: 18, fontWeight: '700'}, description: {fontSize: 15, lineHeight: 23, marginTop: 10}, version: {textAlign: 'center', marginTop: 12}});
