import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function TextDemo() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SHOPAI</Text>

      <Text style={styles.subtitle}>
        Thực hành Core Component: Text
      </Text>

      <Text style={styles.normal}>
        Đây là một đoạn văn bản bình thường trong React Native.
      </Text>

      <Text style={styles.bold}>
        Đây là chữ in đậm.
      </Text>

      <Text style={styles.colored}>
        Đây là chữ có màu.
      </Text>

      <Text style={styles.center}>
        Đây là chữ được căn giữa.
      </Text>

      <Text style={styles.mixed}>
        Học React Native{' '}
        <Text style={styles.highlight}>
          từng bước
        </Text>{' '}
        để hiểu rõ cách hoạt động của component Text.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 24,
    justifyContent: 'center',
  },

  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FF4D4F',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 32,
  },

  normal: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 16,
  },

  bold: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 16,
  },

  colored: {
    fontSize: 16,
    color: '#3498DB',
    marginBottom: 16,
  },

  center: {
    fontSize: 16,
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 16,
  },

  mixed: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 24,
  },

  highlight: {
    color: '#FF4D4F',
    fontWeight: '700',
  },
});