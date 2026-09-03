import React, {
  memo,
  useEffect,
} from 'react';

import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import ShopButton from '@components/ui/ShopButton';
import {COLORS, SIZES} from '@constants/theme';
import {Product} from '@data/mockProducts';

type ProductCardProps = {
  product: Product;
};

const {width} = Dimensions.get('window');
const GAP = SIZES.padding;
const CARD_WIDTH =
  (width - GAP * 3) / 2;

function ProductCard({
  product,
}: ProductCardProps) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 400,
    });
  }, [opacity]);

  const fadeInStyle =
    useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));

  return (
    <Animated.View
      style={[
        styles.card,
        fadeInStyle,
      ]}>
      <Image
        source={{uri: product.image}}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.info}>
        <Text
          numberOfLines={2}
          style={styles.name}>
          {product.name}
        </Text>

        <Text style={styles.price}>
          {product.price.toLocaleString('vi-VN')} đ
        </Text>

        <ShopButton
          title="Mua ngay"
          onPress={() => {}}
          style={styles.button}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginHorizontal: GAP / 2,
    marginBottom: GAP,
    overflow: 'hidden',
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.surface,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  image: {
    width: '100%',
    height: CARD_WIDTH,
  },

  info: {
    padding: 10,
  },

  name: {
    height: 40,
    color: COLORS.text,
    fontSize: SIZES.body2,
    fontWeight: '500',
  },

  price: {
    marginVertical: 8,
    color: COLORS.primary,
    fontSize: SIZES.body1,
    fontWeight: '700',
  },

  button: {
    height: 36,
  },
});

export default memo(ProductCard);