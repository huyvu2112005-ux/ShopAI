import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function ViewDemo() {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerText}>HEADER</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.contentText}>NỘI DUNG</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>FOOTER</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  header: {
    height: 100,
    backgroundColor: '#FF4D4F',
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  footer: {
    height: 80,
    backgroundColor: '#2C3E50',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },

  contentText: {
    color: '#2C3E50',
    fontSize: 22,
    fontWeight: '700',
  },

  footerText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});