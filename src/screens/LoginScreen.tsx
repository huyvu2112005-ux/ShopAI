import React, {useState} from 'react';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ShopButton from '@components/ui/ShopButton';
import ShopInput from '@components/ui/ShopInput';
import {COLORS, SIZES} from '@constants/theme';
import {useAuthStore} from '../store/useAuthStore';

interface LoginScreenProps {
  onGoToRegister: () => void;
}

const LoginScreen = ({onGoToRegister}: LoginScreenProps): React.JSX.Element => {
  const login = useAuthStore(state => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      Alert.alert(
        'Thiếu thông tin',
        'Vui lòng nhập email.',
      );
      return;
    }

    if (!cleanEmail.includes('@')) {
      Alert.alert(
        'Email chưa hợp lệ',
        'Email phải chứa ký tự @.',
      );
      return;
    }

    if (!password) {
      Alert.alert(
        'Thiếu thông tin',
        'Vui lòng nhập mật khẩu.',
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Mật khẩu chưa hợp lệ',
        'Mật khẩu phải có ít nhất 6 ký tự.',
      );
      return;
    }

    login('demo-token');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }>
      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        keyboardShouldPersistTaps="handled">
        <View style={styles.brandSection}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>
              S
            </Text>
          </View>

          <Text style={styles.brandName}>
            ShopAI
          </Text>

          <Text style={styles.subtitle}>
            Mua sắm công nghệ thông minh
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.title}>
            Đăng nhập
          </Text>

          <Text style={styles.description}>
            Đăng nhập để tiếp tục mua sắm
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Email
            </Text>

            <ShopInput
              placeholder="example@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Mật khẩu
            </Text>

            <ShopInput
              placeholder="Nhập mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <ShopButton
            title="Đăng nhập"
            onPress={handleLogin}
            style={styles.loginButton}
          />

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>
              Chưa có tài khoản?
            </Text>

            <Text
              style={styles.registerLink}
              onPress={onGoToRegister}>
              {' '}
              Đăng ký ngay
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SIZES.padding,
  },

  brandSection: {
    alignItems: 'center',
    marginBottom: 28,
  },

  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor:
      COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
  },

  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#777777',
  },

  formCard: {
    backgroundColor:
      COLORS.surface,
    borderRadius: 18,
    padding: 20,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },

  description: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 22,
  },

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },

  loginButton: {
    width: '100%',
    marginTop: 4,
  },

  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },

  registerText: {
    fontSize: 14,
    color: '#777777',
  },

  registerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

export default LoginScreen;