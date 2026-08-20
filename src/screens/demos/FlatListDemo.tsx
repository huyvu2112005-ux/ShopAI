import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';

const products = [
  {
    id: '1',
    name: 'iPhone 15',
    price: '20.000.000đ',
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24',
    price: '18.000.000đ',
  },
  {
    id: '3',
    name: 'Xiaomi 14',
    price: '15.000.000đ',
  },
  {
    id: '4',
    name: 'OPPO Reno 12',
    price: '12.000.000đ',
  },
  {
    id: '5',
    name: 'Vivo V30',
    price: '11.000.000đ',
  },
];

export default function FlatListDemo() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FlatList Demo</Text>

      <FlatList
        data={products}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Text style={styles.name}>
              {item.name}
            </Text>

            <Text style={styles.price}>
              {item.price}
            </Text>
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

  item: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
  },

  price: {
    fontSize: 15,
    color: '#7F8C8D',
    marginTop: 6,
  },
});