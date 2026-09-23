export const WAREHOUSE_COORDS = {
  latitude: 10.7769,
  longitude: 106.7009,
};

export const SHIPPING_TIERS = [
  {maxKm: 5, fee: 15000, label: 'Noi thanh - giao trong 2 gio'},
  {maxKm: 20, fee: 25000, label: 'Ngoai thanh - giao trong ngay'},
  {maxKm: 100, fee: 40000, label: 'Lien tinh gan - 1-2 ngay'},
  {maxKm: Infinity, fee: 60000, label: 'Lien tinh xa - 3-5 ngay'},
];

export const DEFAULT_SHIPPING_FEE = 30000;

export const getDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const radiusKm = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return radiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const getShippingTier = (distanceKm: number) =>
  SHIPPING_TIERS.find(tier => distanceKm <= tier.maxKm) ??
  SHIPPING_TIERS[SHIPPING_TIERS.length - 1];
