import React, {useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from 'react-native';

export default function ActivityIndicatorDemo() {
  const [loading, setLoading] = useState(false);

  const handleLoading = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        ActivityIndicator Demo
      </Text>

      <Text style={styles.description}>
        Nhấn nút để mô phỏng quá trình tải dữ liệu.
      </Text>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator
            size="large"
            color="#FF4D4F"
          />

          <Text style={styles.loadingText}>
            Đang tải dữ liệu...
          </Text>
        </View>
      ) : (
        <Text style={styles.successText}>
          Dữ liệu đã sẵn sàng
        </Text>
      )}

      <Pressable
        style={styles.button}
        onPress={handleLoading}>
        <Text style={styles.buttonText}>
          BẮT ĐẦU TẢI
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

  loadingBox: {
    alignItems: 'center',
    marginBottom: 30,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7F8C8D',
  },

  successText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#27AE60',
    marginBottom: 30,
  },

  button: {
    backgroundColor: '#FF4D4F',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});