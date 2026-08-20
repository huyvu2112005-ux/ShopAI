import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

export default function ImageDemo() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Image Demo</Text>

      <Text style={styles.label}>
        Ảnh từ Internet
      </Text>

      <Image
        source={{
          uri: 'https://reactnative.dev/img/tiny_logo.png',
        }}
        style={styles.image}
      />

      <Text style={styles.description}>
        Đây là ví dụ hiển thị hình ảnh bằng component Image.
      </Text>
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
    fontSize: 30,
    fontWeight: '800',
    color: '#FF4D4F',
    marginBottom: 30,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 16,
  },

  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },

  description: {
    fontSize: 15,
    color: '#7F8C8D',
    textAlign: 'center',
  },
});