import React from 'react';
import {ActivityIndicator, Modal, StyleSheet, Text, View} from 'react-native';
import {useAppLock} from '../hooks/useAppLock';
import {useAuthStore} from '../store/useAuthStore';
import {useThemeColors} from '../contexts/ThemeContext';
import ShopButton from './ui/ShopButton';

export default function AppLockGate({children}: {children: React.ReactNode}) {
  const token = useAuthStore(state => state.token);
  const logout = useAuthStore(state => state.logout);
  const {locked, checking, error, unlock} = useAppLock(token);
  const colors = useThemeColors();
  return <View style={styles.fill}>
    <View style={styles.fill} importantForAccessibility={locked ? 'no-hide-descendants' : 'auto'} accessibilityElementsHidden={locked}>{children}</View>
    <Modal visible={locked} animationType="fade" onRequestClose={() => {}}>
      <View style={[styles.lock, {backgroundColor: colors.background}]}>
        <Text style={[styles.logo, {color: colors.primary}]}>ShopAI</Text>
        <Text style={[styles.title, {color: colors.text}]}>Ứng dụng đã khóa</Text>
        <Text style={[styles.description, {color: colors.textLight}]}>{error || 'Xác thực vân tay hoặc Face ID để tiếp tục mua sắm an toàn.'}</Text>
        {checking && <ActivityIndicator accessibilityLabel="Đang xác thực" color={colors.primary} />}
        <ShopButton title="Thử lại" loading={checking} onPress={() => {unlock();}} />
        <ShopButton title="Đăng nhập bằng mật khẩu" variant="outline" onPress={() => {logout();}} />
      </View>
    </Modal>
  </View>;
}
const styles = StyleSheet.create({fill: {flex: 1}, lock: {flex: 1, justifyContent: 'center', padding: 28, gap: 18}, logo: {fontSize: 36, fontWeight: '800', textAlign: 'center'}, title: {fontSize: 24, fontWeight: '700', textAlign: 'center'}, description: {fontSize: 16, lineHeight: 24, textAlign: 'center'}});
