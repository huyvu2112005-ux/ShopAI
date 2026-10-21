import {formatCurrency} from '@utils/formatCurrency';
import {useThemedStyles} from '../hooks/useThemedStyles';
import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';

import ShopButton from '../components/ui/ShopButton';
import {ThemeColors, SIZES} from '../constants/theme';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {apiError, getOrder, payOrder} from '../services/shopApi';
import {AppStackParamList} from '../types/navigationTypes';

type Props = NativeStackScreenProps<AppStackParamList, 'OrderDetail'>;

function OrderDetailScreen({route}: Props): React.JSX.Element {
  const {styles} = useThemedStyles(makeStyles);

  const queryClient = useQueryClient();
  const {data: order, isLoading, error, refetch} = useQuery({queryKey: ['orders', route.params.orderId], queryFn: () => getOrder(route.params.orderId)});
  const payment = useMutation({
    mutationFn: () => payOrder(route.params.orderId),
    onSuccess: paidOrder => {
      queryClient.setQueryData(['orders', paidOrder.id], paidOrder);
      queryClient.invalidateQueries({queryKey: ['orders']});
    },
  });
  if (isLoading) {return <SafeAreaView style={styles.safeArea}><Text>Đang tải hóa đơn...</Text></SafeAreaView>;}

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.missing}>{error ? apiError(error) : 'Không tìm thấy đơn hàng.'}</Text>
          <ShopButton title="Thử lại" onPress={() => {refetch();}} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Chi tiết hóa đơn</Text>
        <Text style={styles.row}>Mã đơn: {order.id}</Text>
        <Text style={styles.row}>Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}</Text>
        <Text style={styles.row}>Trạng thái: {order.status}</Text>

        <Text style={styles.sectionTitle}>Sản phẩm</Text>
        {order.items.map(item => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.name} x {item.quantity}</Text>
            <Text style={styles.itemPrice}>{formatCurrency(item.price * item.quantity)}</Text>
          </View>
        ))}

        <Text style={styles.total}>Tổng cộng: {formatCurrency(order.total)}</Text>
        {payment.isError && <Text style={styles.missing}>{apiError(payment.error)}</Text>}
        {order.status === 'PENDING' ? (
          <ShopButton
            testID="order-pay" title="Thanh toán đơn hàng"
            loading={payment.isPending}
            onPress={() => payment.mutate()}
            style={styles.button}
          />
        ) : (
          <Text style={styles.paidNote}>Đã thanh toán thành công ✓</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (COLORS: ThemeColors) => StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: COLORS.background},
  container: {padding: SIZES.padding},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  heading: {fontSize: SIZES.h1, fontWeight: '800', color: COLORS.text, marginBottom: 18},
  row: {color: COLORS.text, marginBottom: 8},
  sectionTitle: {fontSize: SIZES.h3, fontWeight: '800', color: COLORS.primary, marginTop: 24, marginBottom: 8},
  itemRow: {flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingVertical: 12},
  itemName: {flex: 1, color: COLORS.text},
  itemPrice: {color: COLORS.text, fontWeight: '700'},
  total: {fontSize: SIZES.h3, fontWeight: '800', color: COLORS.primary, marginTop: 20},
  button: {marginTop: 24},
  paidNote: {color: COLORS.success, fontWeight: '800', textAlign: 'center', marginTop: 26},
  missing: {color: COLORS.textLight, fontSize: SIZES.body1},
});

export default OrderDetailScreen;
