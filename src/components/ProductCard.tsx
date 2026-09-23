import React from 'react';

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {Product} from '../data/mockProducts';
import {useCartStore} from '../store/useCartStore';

interface Props {
  product: Product;
  onPress?: () => void;
}

function ProductCard({product, onPress}: Props) {
  const addItem = useCartStore(state => state.addItem);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={styles.productArea}>
        <View style={styles.imageWrap}>
          <Image source={product.image} style={styles.image} />
        </View>

        <Text style={styles.category}>{product.category}</Text>

        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.ratingRow}>
          <Text style={styles.rating}>★ {product.rating}</Text>
          <Text style={styles.stock}>Còn {product.stock}</Text>
        </View>

        <Text style={styles.price}>{product.price.toLocaleString()} đ</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          addItem(product);
        }}>
        <Text style={styles.buttonText}>+ Thêm vào giỏ</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 14,
    margin: 6,
    minHeight: 300,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  productArea: {
    flex: 1,
  },

  imageWrap: {
    height: 132,
    borderRadius: 10,
    backgroundColor: '#F7F8FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  image: {
    width: '88%',
    height: '88%',
    resizeMode: 'contain',
  },

  category: {
    color: '#8B95A5',
    fontSize: 11,
    marginBottom: 4,
  },

  name: {
    color: '#263445',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    minHeight: 40,
  },

  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },

  rating: {
    color: '#B77A00',
    fontSize: 12,
    fontWeight: '700',
  },

  stock: {
    color: '#8B95A5',
    fontSize: 11,
  },

  price: {
    color: '#FF4D4F',
    fontSize: 15,
    fontWeight: '800',
    marginVertical: 10,
  },

  button: {
    backgroundColor: '#FF4D4F',
    minHeight: 42,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
});
