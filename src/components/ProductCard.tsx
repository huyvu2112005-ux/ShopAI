import {formatCurrency} from '@utils/formatCurrency';
import {useThemedStyles} from '../hooks/useThemedStyles';
import {ThemeColors} from '../constants/theme';
import React from 'react';
import Animated, {FadeIn, ReduceMotion} from 'react-native-reanimated';

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
  const {styles} = useThemedStyles(makeStyles);

  const addItem = useCartStore(state => state.addItem);
  const cartQuantity = useCartStore(state => state.items.find(item => item.id === product.id)?.quantity ?? 0);
  const cannotAdd = cartQuantity >= Math.min(product.stock, 100);

  return (
    <Animated.View entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)} style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={styles.productArea}>
        <View style={styles.imageWrap}>
          <Image source={product.image} style={styles.image} />
          <View style={styles.favoriteDot}>
            <Text style={styles.favoriteText}>♡</Text>
          </View>
        </View>

        <Text style={styles.category} numberOfLines={1}>
          {product.category}
        </Text>

        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.ratingRow}>
          <Text style={styles.rating}>★ {product.rating}</Text>
          <Text style={styles.stock}>Còn {product.stock}</Text>
        </View>

        <Text style={styles.price}>{formatCurrency(product.price)}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        accessibilityRole="button"
        disabled={cannotAdd}
        onPress={() => {
          addItem(product);
        }}>
        <Text style={styles.buttonText}>{product.stock === 0 ? 'Hết hàng' : cannotAdd ? 'Đã đủ số lượng' : 'Thêm vào giỏ'}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default React.memo(ProductCard);

const makeStyles = (COLORS: ThemeColors) => StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: 10,
    borderRadius: 18,
    marginHorizontal: 6,
    marginVertical: 7,
    minHeight: 284,
    shadowColor: '#1E3A5F',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F7E6E8',
  },

  productArea: {
    flex: 1,
  },

  imageWrap: {
    height: 124,
    borderRadius: 16,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },

  image: {
    width: '86%',
    height: '86%',
    resizeMode: 'contain',
  },

  favoriteDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  favoriteText: {
    color: COLORS.primary,
    fontSize: 17,
    lineHeight: 20,
    fontWeight: '900',
  },

  category: {
    color: COLORS.textLight,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 4,
  },

  name: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 19,
    minHeight: 44,
  },

  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },

  rating: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '900',
  },

  stock: {
    color: COLORS.textLight,
    fontSize: 11,
    fontWeight: '700',
  },

  price: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 8,
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#FF4D4F',
    minHeight: 38,
    paddingHorizontal: 8,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: COLORS.onPrimary,
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },
});
