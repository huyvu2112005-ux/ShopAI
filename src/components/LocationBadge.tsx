import {useThemedStyles} from '../hooks/useThemedStyles';
import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native';

import {
  DEFAULT_SHIPPING_FEE,
  WAREHOUSE_COORDS,
  getDisplayShippingDistance,
  getDistanceKm,
  getShippingTier,
} from '@constants/shipping';
import {ThemeColors, SIZES} from '@constants/theme';
import {useCurrentLocation} from '@hooks/useCurrentLocation';

const formatVnd = (value: number) => `${value.toLocaleString('vi-VN')} đ`;

const LocationBadge = (): React.JSX.Element => {
  const {colors: COLORS, styles} = useThemedStyles(makeStyles);

  const {coords, loading, error, refresh} = useCurrentLocation();

  if (loading) {
    return (
      <View style={[styles.badge, styles.neutralBadge]}>
        <View style={styles.pinCircle}>
          <ActivityIndicator size="small" color={COLORS.secondary} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Đang xác định vị trí</Text>
          <Text style={styles.subtitle}>
            ShopAI dùng GPS để ước tính phí giao hàng.
          </Text>
        </View>
      </View>
    );
  }

  if (error || !coords) {
    return (
      <Pressable
        style={[styles.badge, styles.warningBadge]}
        onPress={refresh}>
        <View style={[styles.pinCircle, styles.warningPin]}>
          <Text style={styles.pinText}>!</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>
            {error ?? 'Chưa rõ vị trí'}
          </Text>
          <Text style={styles.subtitle}>
            Tạm tính phí ship {formatVnd(DEFAULT_SHIPPING_FEE)}
          </Text>
        </View>
        <Text style={styles.actionText}>Thử lại</Text>
      </Pressable>
    );
  }

  const realDistanceKm = getDistanceKm(
    coords.latitude,
    coords.longitude,
    WAREHOUSE_COORDS.latitude,
    WAREHOUSE_COORDS.longitude,
  );
  const {distanceKm, isDemoDistance} =
    getDisplayShippingDistance(realDistanceKm);
  const tier = getShippingTier(distanceKm);

  return (
    <Pressable style={[styles.badge, styles.successBadge]} onPress={refresh}>
      <View style={[styles.pinCircle, styles.successPin]}>
        <Text style={styles.pinText}>⌖</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>
          Cách kho {distanceKm.toFixed(1)} km
        </Text>
        <Text style={styles.subtitle}>
          {tier.label} · Phí ship {formatVnd(tier.fee)}
        </Text>
        <Text style={styles.coords}>
          GPS: {coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}
          {isDemoDistance ? ' · mô phỏng giao hàng nội địa' : ''}
        </Text>
      </View>
      <Text style={styles.actionText}>Làm mới</Text>
    </Pressable>
  );
};

const makeStyles = (COLORS: ThemeColors) => StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.padding,
    marginTop: 10,
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: '#1E3A5F',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },

  neutralBadge: {
    backgroundColor: COLORS.surface,
    borderColor: '#DDEAF8',
  },

  warningBadge: {
    backgroundColor: COLORS.warningSoft,
    borderColor: '#FFE3A3',
  },

  successBadge: {
    backgroundColor: COLORS.successSoft,
    borderColor: '#BDEDCF',
  },

  pinCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#EAF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  warningPin: {
    backgroundColor: '#F59E0B',
  },

  successPin: {
    backgroundColor: COLORS.success,
  },

  pinText: {
    color: COLORS.onPrimary,
    fontSize: 18,
    fontWeight: '900',
  },

  content: {
    flex: 1,
    paddingRight: 8,
  },

  title: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.text,
  },

  subtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 3,
    lineHeight: 17,
  },

  coords: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 3,
    fontWeight: '700',
  },

  actionText: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: '900',
  },
});

export default LocationBadge;
