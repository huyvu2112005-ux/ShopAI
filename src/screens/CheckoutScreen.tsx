import {formatCurrency} from '@utils/formatCurrency';
import {useThemedStyles} from '../hooks/useThemedStyles';
import React, {useRef} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

import ShopButton from '../components/ui/ShopButton';
import {ThemeColors, SIZES} from '../constants/theme';
import {useCartStore} from '../store/useCartStore';
import {apiError, createOrder} from '../services/shopApi';
import {addCrashBreadcrumb, recordNonFatal, setCrashContext} from '../services/crashReporting';

function CheckoutScreen(): React.JSX.Element {
  const {colors: COLORS, styles} = useThemedStyles(makeStyles);

  const navigation = useNavigation<any>();
  const items = useCartStore(state => state.items);
  const completeCheckout = useCartStore(state => state.completeCheckout);
  const submitting = useRef(false);
  const total = useCartStore(state => state.totalPrice());
  const queryClient = useQueryClient();

  const mutation = useMutation({
    onMutate: () => {
      addCrashBreadcrumb(`Checkout: bắt đầu đặt đơn, ${items.length} loại sản phẩm`);
      setCrashContext({
        screen: 'CheckoutScreen',
        cart_item_count: String(items.length),
        cart_total: String(total),
      });
    },
    mutationFn: createOrder,
    onSuccess: (_order, submitted) => {
      addCrashBreadcrumb('Checkout: server xác nhận đơn hàng thành công');
      queryClient.invalidateQueries({queryKey: ['orders']});
      completeCheckout(submitted.items.map(item => ({id: item.productId, quantity: item.quantity})));
    },
    onSettled: () => {submitting.current = false;},
    onError: error => {
      addCrashBreadcrumb(`Checkout: đặt đơn thất bại - ${apiError(error)}`);
      recordNonFatal(error, 'CheckoutOrderFailed');
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
          <Text style={styles.total}>{formatCurrency(total)}</Text>
        </View>
        {mutation.isError && (
          <Text style={styles.error}>{apiError(mutation.error)}</Text>
        )}
        {mutation.isPending ? (
          <ActivityIndicator color={COLORS.primary} size="large" style={styles.loader} />
        ) : (
          <ShopButton
            testID="checkout-confirm" title="Xác nhận đặt hàng"
            onPress={() => {
              if (submitting.current || !items.length) {return;}
              submitting.current = true;
              mutation.mutate({items: items.map(item => ({productId: item.id, quantity: item.quantity})), total});
            }}
            disabled={items.length === 0}
            style={styles.button}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (COLORS: ThemeColors) => StyleSheet.create({
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
