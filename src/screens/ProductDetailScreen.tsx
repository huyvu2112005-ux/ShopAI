import {formatCurrency} from '@utils/formatCurrency';
import {useThemedStyles} from '../hooks/useThemedStyles';
import React, {useState} from 'react';

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import ShopButton from '@components/ui/ShopButton';
import LocationBadge from '@components/LocationBadge';
import {ThemeColors, SIZES} from '@constants/theme';
import {useQuery} from '@tanstack/react-query';
import {fetchProductById} from '../services/productQuery';
import {apiError} from '../services/shopApi';
import {useCartStore} from '../store/useCartStore';

import {
  HomeStackParamList,
} from '../types/navigationTypes';

type ProductDetailScreenProps =
  NativeStackScreenProps<
    HomeStackParamList,
    'ProductDetail'
  >;

const ProductDetailScreen = ({
  navigation,
  route,
}: ProductDetailScreenProps): React.JSX.Element => {
  const {styles} = useThemedStyles(makeStyles);

  const addItem = useCartStore(state => state.addItem);
  const {productId} = route.params;

  const {data: product, isLoading, error, refetch} = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId),
    retry: 1,
  });
  const [quantity, setQuantity] = useState(1);
  const cartQuantity = useCartStore(state => state.items.find(item => item.id === (product?.id ?? productId))?.quantity ?? 0);
  if (isLoading) {
    return <SafeAreaView style={styles.notFoundContainer}><Text style={styles.notFoundText}>Đang tải sản phẩm...</Text></SafeAreaView>;
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.notFoundContainer}>
        <Text style={styles.notFoundTitle}>
          Không tìm thấy sản phẩm
        </Text>

        <Text style={styles.notFoundText}>
          {error ? apiError(error) : 'Sản phẩm này hiện không tồn tại trong ShopAI.'}
        </Text>

        <ShopButton
          title="Thử lại"
          onPress={() => {refetch();}}
          style={styles.notFoundButton}
        />
      </SafeAreaView>
    );
  }

  const originalPrice = Math.round(product.price * 1.12);
  const available = Math.max(0, Math.min(product.stock, 100) - cartQuantity);
  const selectedQuantity = Math.min(quantity, available);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            style={styles.iconButton}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <View style={styles.topActions}>
            <View style={styles.smallIconButton}>
              <Text style={styles.smallIconText}>♡</Text>
            </View>
            <View style={styles.smallIconButton}>
              <Text style={styles.smallIconText}>↗</Text>
            </View>
          </View>
        </View>

        <View style={styles.imageSection}>
          <Image
            source={product.image}
            style={styles.productImage}
            resizeMode="contain"
          />
          <View style={styles.imageCounter}>
            <Text style={styles.imageCounterText}>1/1</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.category}>
            {product.category}
          </Text>

          <Text style={styles.name}>
            {product.name}
          </Text>

          <View style={styles.metaRow}>
            <Text style={styles.ratingText}>
              ★ {product.rating} đánh giá
            </Text>

            <Text style={styles.stockText}>
              Còn {product.stock} sản phẩm
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatCurrency(product.price)}</Text>
            <Text style={styles.originalPrice}>
              {formatCurrency(originalPrice)}
            </Text>
            <View style={styles.salePill}>
              <Text style={styles.saleText}>-12%</Text>
            </View>
          </View>

          <View style={styles.specGrid}>
            {product.specs.map(spec => (
              <View key={spec.label} style={styles.specCard}>
                <Text style={styles.specLabel}>{spec.label}</Text>
                <Text style={styles.specValue}>{spec.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.descriptionBox}>
            <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
            <Text style={styles.description}>
              {product.description}
            </Text>
          </View>
        </View>

        <LocationBadge />
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.quantityBox}>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Giảm số lượng" disabled={selectedQuantity <= 1} onPress={() => setQuantity(Math.max(1, selectedQuantity - 1))}>
            <Text style={styles.quantityText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantityNumber}>{selectedQuantity}</Text>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Tăng số lượng" disabled={selectedQuantity >= available} onPress={() => setQuantity(selectedQuantity + 1)}>
            <Text style={styles.quantityText}>+</Text>
          </TouchableOpacity>
        </View>

        <ShopButton
          title={product.stock === 0 ? 'Hết hàng' : available === 0 ? 'Đã đủ số lượng' : 'Thêm vào giỏ'}
          disabled={available === 0}
          onPress={() => {if (addItem(product, selectedQuantity)) {setQuantity(1);}}}
          testID="add-to-cart"
          style={styles.addToCartButton}
        />
        <ShopButton title="Mua ngay" variant="outline" disabled={available === 0}
          onPress={() => {if (addItem(product, selectedQuantity)) {setQuantity(1); navigation.getParent()?.navigate('Cart');}}}
          style={styles.buyNowButton} />
      </View>
    </SafeAreaView>
  );
};

const makeStyles = (COLORS: ThemeColors) => StyleSheet.create({
  buyNowButton: {flex: 1, marginLeft: 8, paddingHorizontal: 8},
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
  },

  contentContainer: {
    paddingBottom: 112,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingTop: 8,
    paddingBottom: 10,
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backText: {
    color: COLORS.text,
    fontSize: 34,
    lineHeight: 36,
    fontWeight: '300',
  },

  topActions: {
    flexDirection: 'row',
    gap: 9,
  },

  smallIconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },

  smallIconText: {
    color: COLORS.secondary,
    fontSize: 18,
    fontWeight: '900',
  },

  imageSection: {
    marginHorizontal: SIZES.padding,
    minHeight: 310,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  productImage: {
    width: '88%',
    height: 265,
  },

  imageCounter: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    minWidth: 42,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(30,41,59,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  imageCounterText: {
    color: COLORS.onPrimary,
    fontSize: 12,
    fontWeight: '900',
  },

  infoSection: {
    paddingHorizontal: SIZES.padding,
    paddingTop: 18,
  },

  category: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '800',
    marginBottom: 6,
  },

  name: {
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '900',
    color: COLORS.text,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  ratingText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#D97706',
  },

  stockText: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '700',
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
    flexWrap: 'wrap',
  },

  price: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.secondary,
  },

  originalPrice: {
    fontSize: 13,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    fontWeight: '700',
  },

  salePill: {
    minHeight: 24,
    borderRadius: 12,
    paddingHorizontal: 8,
    backgroundColor: COLORS.primarySoft,
    justifyContent: 'center',
  },

  saleText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '900',
  },

  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 18,
  },

  specCard: {
    width: '48%',
    minHeight: 62,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: '#F7E0E2',
    padding: 12,
  },

  specLabel: {
    color: COLORS.textLight,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },

  specValue: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '900',
  },

  descriptionBox: {
    marginTop: 18,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: '#F7E0E2',
    padding: 14,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4B5563',
  },

  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: SIZES.padding,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: '#F6E5E7',
  },

  quantityBox: {
    width: 112,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.primarySoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  quantityText: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '900',
  },

  quantityNumber: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '900',
  },

  addToCartButton: {
    flex: 1,
    height: 48,
    backgroundColor: COLORS.secondary,
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
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 8,
  },

  notFoundText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 20,
  },

  notFoundButton: {
    width: 150,
  },
});

export default ProductDetailScreen;
