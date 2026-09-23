import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {useMutation} from '@tanstack/react-query';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

import ShopButton from '../components/ui/ShopButton';
import {COLORS, SIZES} from '../constants/theme';
import {useCartStore} from '../store/useCartStore';
import {useOrderStore} from '../store/useOrderStore';

const createOrder = async (): Promise<{id: string}> => {
  await new Promise<void>(resolve => setTimeout(resolve, 700));
  return {id: `ORD-${Date.now().toString().slice(-6)}`};
};

function CheckoutScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const items = useCartStore(state => state.items);
  const clearCart = useCartStore(state => state.clearCart);
  const total = useCartStore(state => state.totalPrice());
  const addOrder = useOrderStore(state => state.addOrder);

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: result => {
      addOrder({
        id: result.id,
        items: [...items],
        total,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      });
      clearCart();
    },
  });

  if (mutation.isSuccess) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successTitle}>Đặt hàng thành công!</Text>
          <Text style={styles.successText}>Mã đơn: {mutation.data.id}</Text>
          <Text style={styles.pendingText}>Trạng thái: PENDING - Chờ thanh toán</Text>
          <ShopButton
            title="Xem lịch sử đơn hàng"
            onPress={() => navigation.navigate('MainTabs', {screen: 'Orders'})}
            style={styles.button}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Xác nhận đơn hàng</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Số lượng sản phẩm</Text>
          <Text style={styles.value}>{items.reduce((sum, item) => sum + item.quantity, 0)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tổng cộng</Text>
          <Text style={styles.total}>{total.toLocaleString()} đ</Text>
        </View>
        {mutation.isError && (
          <Text style={styles.error}>Đặt hàng thất bại, vui lòng thử lại.</Text>
        )}
        {mutation.isPending ? (
          <ActivityIndicator color={COLORS.primary} size="large" style={styles.loader} />
        ) : (
          <ShopButton
            title="Xác nhận đặt hàng"
            onPress={() => mutation.mutate()}
            disabled={items.length === 0}
            style={styles.button}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: COLORS.background},
  container: {flex: 1, padding: SIZES.padding},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: SIZES.padding},
  title: {fontSize: SIZES.h1, fontWeight: '800', color: COLORS.text, marginBottom: 24},
  row: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border},
  label: {color: COLORS.textLight, fontSize: SIZES.body1},
  value: {color: COLORS.text, fontWeight: '700', fontSize: SIZES.body1},
  total: {color: COLORS.primary, fontWeight: '800', fontSize: SIZES.h2},
  button: {width: '100%', marginTop: 28},
  loader: {marginTop: 28},
  error: {color: COLORS.error, textAlign: 'center', marginTop: 18},
  successIcon: {fontSize: 64, color: COLORS.success, fontWeight: '800'},
  successTitle: {fontSize: SIZES.h2, fontWeight: '800', color: COLORS.success, marginTop: 12},
  successText: {fontSize: SIZES.body1, color: COLORS.text, marginTop: 18},
  pendingText: {fontSize: SIZES.body2, color: COLORS.textLight, marginTop: 8, textAlign: 'center'},
});

export default CheckoutScreen;
