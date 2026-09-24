import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native';

import {
  DEFAULT_SHIPPING_FEE,
  WAREHOUSE_COORDS,
  getDistanceKm,
  getShippingTier,
} from '@constants/shipping';
import {COLORS, SIZES} from '@constants/theme';
import {useCurrentLocation} from '@hooks/useCurrentLocation';

const formatVnd = (value: number) => `${value.toLocaleString('vi-VN')}d`;

const LocationBadge = (): React.JSX.Element => {
  const {coords, loading, error, refresh} = useCurrentLocation();

  if (loading) {
    return (
      <View style={[styles.badge, styles.badgeNeutral]}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.textMuted}>Đang xác định vị trí của bạn...</Text>
      </View>
    );
  }

  if (error || !coords) {
    return (
      <Pressable
        style={[styles.badge, styles.badgeWarning]}
        onPress={refresh}>
        <View style={styles.statusDot} />
        <View style={styles.content}>
          <Text style={styles.title}>
            {error ?? 'Chưa rõ vị trí'}
          </Text>
          <Text style={styles.subtitle}>
            Tạm tính phí ship {formatVnd(DEFAULT_SHIPPING_FEE)}
          </Text>
        </View>
        <Text style={styles.retry}>Thử lại</Text>
      </Pressable>
    );
  }

  const distanceKm = getDistanceKm(
    coords.latitude,
    coords.longitude,
    WAREHOUSE_COORDS.latitude,
    WAREHOUSE_COORDS.longitude,
  );
  const tier = getShippingTier(distanceKm);

  return (
    <Pressable style={[styles.badge, styles.badgeSuccess]} onPress={refresh}>
      <View style={[styles.statusDot, styles.statusDotSuccess]} />
      <View style={styles.content}>
        <Text style={styles.title}>
          Cách kho {distanceKm.toFixed(1)} km - Ship {formatVnd(tier.fee)}
        </Text>
        <Text style={styles.subtitle}>{tier.label}</Text>
        <Text style={styles.coords}>
          ({coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)})
        </Text>
      </View>
      <Text style={styles.retry}>Làm mới</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: SIZES.padding,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEF2',
  },

  badgeNeutral: {
    backgroundColor: '#F8FAFC',
  },

  badgeWarning: {
    backgroundColor: '#FFF8E6',
  },

  badgeSuccess: {
    backgroundColor: '#ECFDF3',
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F59E0B',
  },

  statusDotSuccess: {
    backgroundColor: COLORS.success,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
  },

  subtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },

  coords: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },

  textMuted: {
    fontSize: 13,
    color: COLORS.textLight,
    flex: 1,
    fontWeight: '600',
  },

  retry: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '800',
    marginLeft: 8,
  },
});

export default LocationBadge;
