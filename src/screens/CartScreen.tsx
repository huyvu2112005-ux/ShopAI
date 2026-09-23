import React from 'react';

import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import {COLORS, SIZES} from '@constants/theme';

import {useCartStore} from '../store/useCartStore';

function CartScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const cartItems = useCartStore(state => state.items);
  const clearCart = useCartStore(state => state.clearCart);
  const removeItem = useCartStore(state => state.removeItem);
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Giỏ hàng</Text>
            <Text style={styles.subtitle}>
              {cartItems.length} sản phẩm đang chờ thanh toán
            </Text>
          </View>

          {cartItems.length > 0 && (
            <TouchableOpacity
              onPress={clearCart}
              accessibilityRole="button">
              <Text style={styles.clearText}>Xóa tất cả</Text>
            </TouchableOpacity>
          )}
        </View>

        {cartItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>
            <Text style={styles.emptyText}>
              Hãy chọn một sản phẩm yêu thích để bắt đầu mua sắm.
            </Text>
          </View>
        ) : (
          <>
            <FlatList
              data={cartItems}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <View style={styles.item}>
                  <View style={styles.itemImageWrap}>
                    <Image source={item.image} style={styles.itemImage} />
                  </View>

                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemPrice}>
                      {item.price.toLocaleString()} đ
                    </Text>
                    <Text style={styles.quantity}>Số lượng: {item.quantity}</Text>
                  </View>

                  <View style={styles.itemActions}>
                    <Text style={styles.itemTotal}>
                      {(item.price * item.quantity).toLocaleString()} đ
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeItem(item.id)}
                      accessibilityRole="button">
                      <Text style={styles.removeText}>Xóa</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />

            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tạm tính</Text>
                <Text style={styles.summaryValue}>
                  {total.toLocaleString()} đ
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
                <Text style={styles.freeText}>Miễn phí</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Tổng cộng</Text>
                <Text style={styles.totalValue}>{total.toLocaleString()} đ</Text>
              </View>
              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={() => navigation.navigate('Checkout')}>
                <Text style={styles.checkoutText}>Tiến hành thanh toán</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

export default CartScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    color: COLORS.textLight,
    fontSize: 13,
    marginTop: 4,
  },
  clearText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    padding: SIZES.padding,
    paddingBottom: 12,
  },
  item: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImageWrap: {
    width: 76,
    height: 76,
    borderRadius: 10,
    backgroundColor: '#F7F8FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },
  itemInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  itemName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 19,
  },
  itemPrice: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
  },
  quantity: {
    color: COLORS.textLight,
    fontSize: 12,
    marginTop: 4,
  },
  itemActions: {
    alignItems: 'flex-end',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  itemTotal: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
  },
  removeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  summary: {
    backgroundColor: COLORS.surface,
    padding: SIZES.padding,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  summaryValue: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  freeText: {
    color: COLORS.success,
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  totalLabel: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
  },
  totalValue: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  checkoutText: {
    color: COLORS.surface,
    fontSize: 15,
    fontWeight: '800',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 42,
    marginBottom: 16,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '800',
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
  },
  successState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    backgroundColor: COLORS.background,
  },
  successIconWrap: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9F8EF',
    marginBottom: 20,
  },
  successIcon: {
    color: COLORS.success,
    fontSize: 44,
    fontWeight: '800',
  },
  successTitle: {
    color: COLORS.text,
    fontSize: 23,
    fontWeight: '800',
    textAlign: 'center',
  },
  successText: {
    color: COLORS.textLight,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  orderCodeBox: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginTop: 24,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  orderCodeLabel: {
    color: COLORS.textLight,
    fontSize: 12,
  },
  orderCode: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 4,
  },
  successHint: {
    color: COLORS.textLight,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 18,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    height: 50,
    justifyContent: 'center',
    marginTop: 26,
    paddingHorizontal: 28,
  },
  continueButtonText: {
    color: COLORS.surface,
    fontSize: 15,
    fontWeight: '800',
  },
});
