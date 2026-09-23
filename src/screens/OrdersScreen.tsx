import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {COLORS, SIZES} from '../constants/theme';
import {useOrderStore} from '../store/useOrderStore';

function OrdersScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const orders = useOrderStore(state => state.orders);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <Text style={styles.title}>Đơn hàng của tôi</Text>
        {orders.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>Chưa có đơn hàng nào.</Text>
            <Text style={styles.emptyHint}>Đơn hàng sau khi đặt sẽ được lưu tại đây.</Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('OrderDetail', {orderId: item.id})}>
                <View style={styles.cardRow}>
                  <Text style={styles.orderId}>{item.id}</Text>
                  <Text style={item.status === 'PAID' ? styles.paid : styles.pending}>
                    {item.status}
                  </Text>
                </View>
                <Text style={styles.meta}>{item.items.length} sản phẩm</Text>
                <Text style={styles.total}>{item.total.toLocaleString()} đ</Text>
                <Text style={styles.date}>{new Date(item.createdAt).toLocaleString('vi-VN')}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: COLORS.background},
  container: {flex: 1, padding: SIZES.padding},
  title: {fontSize: SIZES.h1, fontWeight: '800', color: COLORS.text, marginBottom: 18},
  card: {backgroundColor: COLORS.surface, borderRadius: SIZES.radius, padding: 16, marginBottom: 12},
  cardRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  orderId: {fontSize: SIZES.body1, fontWeight: '800', color: COLORS.text},
  pending: {color: '#B77A00', fontWeight: '800'},
  paid: {color: COLORS.success, fontWeight: '800'},
  meta: {color: COLORS.textLight, marginTop: 10},
  total: {color: COLORS.primary, fontSize: SIZES.h3, fontWeight: '800', marginTop: 8},
  date: {color: COLORS.textLight, fontSize: SIZES.small, marginTop: 8},
  empty: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  emptyIcon: {fontSize: 48, marginBottom: 14},
  emptyText: {color: COLORS.text, fontSize: SIZES.h3, fontWeight: '700'},
  emptyHint: {color: COLORS.textLight, marginTop: 8, textAlign: 'center'},
});

export default OrdersScreen;
