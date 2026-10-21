import {useThemedStyles} from '../hooks/useThemedStyles';
import React, {useState} from 'react';
import axiosClient from '../api/axiosClient';
import {apiError} from '../services/shopApi';
import {SessionSchema} from '../types/shop.schema';
import {useAuthStore} from '../store/useAuthStore';

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
import {ThemeColors, SIZES} from '@constants/theme';

interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onGoToLogin: () => void;
}

const RegisterScreen = ({
  onGoToLogin,
}: RegisterScreenProps): React.JSX.Element => {
  const {styles} = useThemedStyles(makeStyles);

  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const handleRegister = async () => {
    if (loading) {return;}
    const cleanName = fullName.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      Alert.alert(
        'Thiếu thông tin',
        'Vui lòng nhập họ và tên.',
      );
      return;
    }

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

    if (!confirmPassword) {
      Alert.alert(
        'Thiếu thông tin',
        'Vui lòng xác nhận mật khẩu.',
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Mật khẩu không khớp',
        'Hai mật khẩu phải giống nhau.',
      );
      return;
    }

    setLoading(true);
    try {
      const {data} = await axiosClient.post('/api/auth/register', {
        name: cleanName, email: cleanEmail, password,
      });
      await useAuthStore.getState().login(SessionSchema.parse(data).accessToken);
    } catch (error) {
      Alert.alert('Đăng ký thất bại', apiError(error));
    } finally {
      setLoading(false);
    }
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
            Tạo tài khoản mua sắm của bạn
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.title}>
            Đăng ký
          </Text>

          <Text style={styles.description}>
            Điền thông tin để tạo tài khoản ShopAI
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Họ và tên
            </Text>

            <ShopInput
              placeholder="Nguyễn Văn A"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

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
              placeholder="Tối thiểu 6 ký tự"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Xác nhận mật khẩu
            </Text>

            <ShopInput
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <ShopButton
            title="Tạo tài khoản"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>
              Đã có tài khoản?
            </Text>

            <Text
              style={styles.loginLink}
              onPress={onGoToLogin}>
              {' '}
              Đăng nhập
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const makeStyles = (COLORS: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SIZES.padding,
  },

  brandSection: {
    alignItems: 'center',
    marginVertical: 24,
  },

  logoBox: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  logoText: {
    color: COLORS.onPrimary,
    fontSize: 34,
    fontWeight: '800',
  },

  brandName: {
    fontSize: 27,
    fontWeight: '800',
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    color: '#777777',
  },

  formCard: {
    backgroundColor: COLORS.surface,
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
    marginBottom: 24,
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
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },

  registerButton: {
    width: '100%',
    marginTop: 6,
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },

  loginText: {
    fontSize: 14,
    color: '#777777',
  },

  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

export default RegisterScreen;
