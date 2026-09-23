import React from 'react';

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {useCartStore} from '../store/useCartStore';

import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import ShopButton from '@components/ui/ShopButton';
import {COLORS, SIZES} from '@constants/theme';

import {
  MOCK_PRODUCTS,
} from '@data/mockProducts';


import {
  HomeStackParamList,
} from '../types/navigationTypes';

type ProductDetailScreenProps =
  NativeStackScreenProps<
    HomeStackParamList,
    'ProductDetail'
  >;

const ProductDetailScreen = ({
  route,
}: ProductDetailScreenProps): React.JSX.Element => {
  const addItem = useCartStore(state => state.addItem);
  const {productId} = route.params;

  const product = MOCK_PRODUCTS.find(
    item => item.id === productId,
  );

  if (!product) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundTitle}>
          Không tìm thấy sản phẩm
        </Text>

        <Text style={styles.notFoundText}>
          Sản phẩm này hiện không tồn tại trong ShopAI.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.contentContainer
      }
      showsVerticalScrollIndicator={false}>
      <View style={styles.imageSection}>
        <Image
          source={product.image}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.category}>
          {product.category}
        </Text>

        <Text style={styles.name}>
          {product.name}
        </Text>

        <Text style={styles.price}>
          {new Intl.NumberFormat(
            'vi-VN',
          ).format(product.price)}{' '}
          đ
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.ratingBox}>
            <Text style={styles.ratingText}>
              ★ {product.rating}
            </Text>
          </View>

          <Text style={styles.stockText}>
            Còn {product.stock} sản phẩm
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>
          Mô tả sản phẩm
        </Text>

        <Text style={styles.description}>
          {product.description}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>
          Thông số sản phẩm
        </Text>

        <View style={styles.specsContainer}>
          {product.specs.map(spec => (
            <View
              key={spec.label}
              style={styles.specRow}>
              <Text style={styles.specLabel}>
                {spec.label}
              </Text>

              <Text style={styles.specValue}>
                {spec.value}
              </Text>
            </View>
          ))}
        </View>

        <ShopButton
          title="Thêm vào giỏ hàng"
          onPress={() => addItem(product)}
          style={styles.addToCartButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  contentContainer: {
    paddingBottom: 32,
  },

  imageSection: {
    backgroundColor: COLORS.surface,
    padding: SIZES.padding,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 320,
  },

  productImage: {
    width: '90%',
    height: 280,
  },

  infoSection: {
    padding: SIZES.padding,
  },

  category: {
    fontSize: 13,
    color: '#777777',
    marginBottom: 8,
  },

  name: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
  },

  price: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 14,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  ratingBox: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8A6D00',
  },

  stockText: {
    fontSize: 14,
    color: '#4B5563',
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
  },

  description: {
    fontSize: 15,
    lineHeight: 23,
    color: '#555555',
  },

  specsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },

  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  specLabel: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
  },

  specValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'right',
  },

  addToCartButton: {
    width: '100%',
    marginTop: 24,
  },

  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.background,
  },

  notFoundTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },

  notFoundText: {
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
  },
});

export default ProductDetailScreen;