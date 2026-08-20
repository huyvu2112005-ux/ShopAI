import React from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';

export default function AlertDemo() {
  const showSimpleAlert = () => {
    Alert.alert(
      'Thông báo',
      'Đây là Alert cơ bản trong React Native.',
    );
  };

  const showConfirmAlert = () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn tiếp tục không?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đồng ý',
          onPress: () => {
            Alert.alert(
              'Thành công',
              'Bạn đã chọn Đồng ý.',
            );
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Alert Demo
      </Text>

      <Text style={styles.description}>
        Nhấn các nút bên dưới để hiển thị Alert.
      </Text>

      <Pressable
        style={styles.button}
        onPress={showSimpleAlert}>
        <Text style={styles.buttonText}>
          HIỆN THÔNG BÁO
        </Text>
      </Pressable>

      <Pressable
        style={styles.confirmButton}
        onPress={showConfirmAlert}>
        <Text style={styles.buttonText}>
          HIỆN XÁC NHẬN
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 30,
  },

  button: {
    width: '100%',
    backgroundColor: '#3498DB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 14,
  },

  confirmButton: {
    width: '100%',
    backgroundColor: '#FF4D4F',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});