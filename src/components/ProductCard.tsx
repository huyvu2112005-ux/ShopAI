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
          <View style={styles.ratingPill}>
            <Text style={styles.rating}>★ {product.rating}</Text>
          </View>

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
    padding: 10,
    borderRadius: 16,
    margin: 6,
    minHeight: 292,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#EEF1F4',
  },

  productArea: {
    flex: 1,
  },

  imageWrap: {
    height: 124,
    borderRadius: 14,
    backgroundColor: '#F7F8FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },

  image: {
    width: '88%',
    height: '88%',
    resizeMode: 'contain',
  },

  category: {
    color: '#8B95A5',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },

  name: {
    color: '#263445',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
    minHeight: 40,
  },

  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },

  ratingPill: {
    minHeight: 24,
    borderRadius: 12,
    backgroundColor: '#FFF7E6',
    paddingHorizontal: 7,
    justifyContent: 'center',
  },

  rating: {
    color: '#B77A00',
    fontSize: 12,
    fontWeight: '800',
  },

  stock: {
    color: '#8B95A5',
    fontSize: 11,
  },

  price: {
    color: '#FF4D4F',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 10,
    marginBottom: 11,
  },

  button: {
    backgroundColor: '#FF4D4F',
    minHeight: 40,
    paddingHorizontal: 8,
    borderRadius: 13,
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
