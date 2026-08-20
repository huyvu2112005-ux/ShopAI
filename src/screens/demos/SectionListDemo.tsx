import React from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
} from 'react-native';

const DATA = [
  {
    title: 'Điện thoại Apple',
    data: [
      'iPhone 15',
      'iPhone 15 Pro',
      'iPhone 15 Pro Max',
    ],
  },
  {
    title: 'Điện thoại Samsung',
    data: [
      'Galaxy S24',
      'Galaxy S24 Plus',
      'Galaxy S24 Ultra',
    ],
  },
  {
    title: 'Điện thoại Xiaomi',
    data: [
      'Xiaomi 14',
      'Redmi Note 13',
      'POCO X6',
    ],
  },
];

export default function SectionListDemo() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SectionList Demo</Text>

      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        )}
        renderSectionHeader={({section: {title}}) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FF4D4F',
    textAlign: 'center',
    marginBottom: 20,
  },

  sectionHeader: {
    backgroundColor: '#E8E8E8',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
  },

  item: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
    borderRadius: 10,
  },

  itemText: {
    fontSize: 16,
    color: '#2C3E50',
  },
});