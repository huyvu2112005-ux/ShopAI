import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';

import ShopButton from '../components/ui/ShopButton';
import {COLORS, SIZES} from '../constants/theme';
import {useOrderStore} from '../store/useOrderStore';
import {AppStackParamList} from '../types/navigationTypes';

type Props = NativeStackScreenProps<AppStackParamList, 'OrderDetail'>;

function OrderDetailScreen({route}: Props): React.JSX.Element {
  const order = useOrderStore(state => state.getById(route.params.orderId));
  const markPaid = useOrderStore(state => state.markPaid);

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.missing}>Không tìm thấy đơn hàng.</Text>
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
            <Text style={styles.itemPrice}>{(item.price * item.quantity).toLocaleString()} đ</Text>
          </View>
        ))}

        <Text style={styles.total}>Tổng cộng: {order.total.toLocaleString()} đ</Text>
        {order.status === 'PENDING' ? (
          <ShopButton
            title="Thanh toán giả lập"
            onPress={() => markPaid(order.id)}
            style={styles.button}
          />
        ) : (
          <Text style={styles.paidNote}>Đã thanh toán thành công ✓</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
