import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {
  SafeAreaView,
} from 'react-native-safe-area-context';

export default function SafeAreaDemo() {
  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            SafeAreaView Demo
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>
            Nội dung an toàn
          </Text>

          <Text style={styles.description}>
            Nội dung màn hình được đặt bên trong SafeAreaView để tránh
            bị che bởi vùng hệ thống của thiết bị.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ShopAI
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  header: {
    backgroundColor: '#FF4D4F',
    paddingVertical: 18,
    alignItems: 'center',
  },

  headerText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 12,
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#7F8C8D',
    textAlign: 'center',
  },

  footer: {
    backgroundColor: '#2C3E50',
    paddingVertical: 16,
    alignItems: 'center',
  },

  footerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});