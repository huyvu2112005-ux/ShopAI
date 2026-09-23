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
      <View style={styles.badge}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.textMuted}>Dang xac dinh vi tri cua ban...</Text>
      </View>
    );
  }

  if (error || !coords) {
    return (
      <Pressable style={styles.badge} onPress={refresh}>
        <Text style={styles.textMuted}>
          {error ?? 'Chua ro vi tri'} - tam tinh phi ship{' '}
          {formatVnd(DEFAULT_SHIPPING_FEE)}
        </Text>
        <Text style={styles.retry}>Thu lai</Text>
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
      <View style={styles.content}>
        <Text style={styles.title}>
          Cach kho {distanceKm.toFixed(1)} km - Ship {formatVnd(tier.fee)}
        </Text>
        <Text style={styles.subtitle}>{tier.label}</Text>
        <Text style={styles.coords}>
          ({coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)})
        </Text>
      </View>
      <Text style={styles.retry}>Lam moi</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    paddingVertical: 10,
    paddingHorizontal: SIZES.padding,
    gap: 8,
  },

  badgeSuccess: {
    backgroundColor: '#E8F5E9',
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 13,
    fontWeight: '700',
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
  },

  retry: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
    marginLeft: 8,
  },
});

export default LocationBadge;
