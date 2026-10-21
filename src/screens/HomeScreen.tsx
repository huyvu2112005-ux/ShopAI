import {formatCurrency} from '@utils/formatCurrency';
import {useThemedStyles} from '../hooks/useThemedStyles';
import React, {useCallback, useMemo, useState} from 'react';

import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {DrawerActions} from '@react-navigation/native';
import {useThemeMode} from '../contexts/ThemeContext';
import useDebounce from '../hooks/useDebounce';
import {productCodeFromScan} from '../utils/scanCode';
import {ZodError} from 'zod';

import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  FlashList,
} from '@shopify/flash-list';

import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import ProductCard from '@components/ProductCard';
import LocationBadge from '@components/LocationBadge';
import ShopButton from '@components/ui/ShopButton';

import {
  ThemeColors,
  SIZES,
} from '@constants/theme';

import axiosClient from '../api/axiosClient';
import {fetchProductsPage, fetchProductById} from '@services/productQuery';
import {useAuthStore} from '../store/useAuthStore';
import {APP_VERSION, ENABLE_CRASH_TEST} from '../constants/env';
import {addCrashBreadcrumb, triggerTestCrash} from '../services/crashReporting';

import {
  HomeStackParamList,
} from '../types/navigationTypes';

type HomeScreenProps =
  NativeStackScreenProps<
    HomeStackParamList,
    'Home'
  >;

const categoryShortName = (category: string) => {
  if (category === 'Điện thoại') {
    return 'Phone';
  }

  if (category === 'Máy tính bảng') {
    return 'Tablet';
  }

  if (category === 'Đồng hồ thông minh') {
    return 'Watch';
  }

  if (category === 'Phụ kiện máy tính') {
    return 'Phụ kiện';
  }

  if (category === 'Pin sạc dự phòng') {
    return 'Pin sạc';
  }

  return category;
};

const HomeScreen = ({
  navigation,
  route,
}: HomeScreenProps): React.JSX.Element => {
  const {colors: COLORS, styles} = useThemedStyles(makeStyles);

  const logout = useAuthStore(state => state.logout);
  const {isDark, toggleTheme} = useThemeMode();
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText.trim().slice(0, 100), 300);
  const health = useQuery({queryKey: ['health'], queryFn: () => axiosClient.get('/api/health'), retry: false, staleTime: 15000});
  const serverOnline = health.isPending ? null : !health.isError;
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['productsInfinite', debouncedSearch],
    queryFn: ({pageParam}) => fetchProductsPage({pageParam, search: debouncedSearch}),
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.nextPage,
  });

  const products = useMemo(() => data?.pages.flatMap(page => page.items) ?? [], [data]);
  const scannedCode = route.params?.scannedCode;
  const {data: scannedProduct} = useQuery({queryKey: ['scan', scannedCode], queryFn: () => fetchProductById(productCodeFromScan(scannedCode ?? '')), enabled: !!scannedCode, retry: false});

  const normalizedSearchText =
    searchText.trim().toLowerCase();

  const filteredProducts = products.filter(
    product =>
      product.name.toLowerCase().includes(normalizedSearchText) ||
      product.category.toLowerCase().includes(normalizedSearchText),
  );

  const categories = useMemo(
    () =>
      Array.from(
        new Set(products.map(product => product.category)),
      ).slice(0, 5),
    [products],
  );

  const heroProducts = products.slice(0, 3);

  const handleProductPress =
    useCallback(
      (productId: string) => {
        navigation.navigate(
          'ProductDetail',
          {
            productId,
          },
        );
      },
      [navigation],
    );

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.brandRow}>
            <View style={styles.logoMark}>
              <View style={styles.logoHandle} />
              <View style={styles.logoBag}>
                <Text style={styles.logoIcon}>AI</Text>
                <View style={styles.logoPulse} />
              </View>
            </View>

            <View>
              <Text style={styles.brandName}>ShopAI</Text>
              <Text style={{color: serverOnline === null ? COLORS.textLight : serverOnline ? COLORS.success : COLORS.error}}>
                {serverOnline === null ? '● Đang kiểm tra' : serverOnline ? '● Server Online' : '● Server Offline'}
              </Text>
              <Text style={styles.brandSub}>
                Mua sắm thông minh
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={logout}
            accessibilityRole="button"
            style={styles.logoutButton}>
            <Text style={styles.logoutText}>Thoát</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.quickActions}>
          <ShopButton title="Menu" accessibilityLabel="Mở menu ShopAI" variant="outline" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={styles.quickButton} />
          <ShopButton title="Hỏi AI" variant="secondary" onPress={() => navigation.navigate('AIChat')} style={styles.quickButton} />
          <ShopButton title={isDark ? 'Sáng' : 'Tối'} accessibilityLabel={isDark ? 'Chuyển giao diện sáng' : 'Chuyển giao diện tối'} variant="outline" onPress={toggleTheme} style={styles.quickButton} />
        </View>

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Tìm sản phẩm, danh mục..."
            placeholderTextColor="#8EA0B5"
            style={styles.searchInput}
            returnKeyType="search"
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('Scanner')}
            accessibilityRole="button"
            style={styles.scanIconButton}>
            <Text style={styles.scanIconText}>QR</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroEyebrow}>Công nghệ mới</Text>
            <Text style={styles.heroTitle}>
              Quét mã để mua nhanh hơn
            </Text>
            <Text style={styles.heroDesc}>
              Dùng camera thật để đọc QR hoặc mã vạch sản phẩm.
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('Scanner')}
              accessibilityRole="button"
              style={styles.heroButton}>
              <Text style={styles.heroButtonText}>Quét ngay</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroImages}>
            {heroProducts.map((product, index) => (
              <Image
                key={product.id}
                source={product.image}
                style={[
                  styles.heroImage,
                  index === 1 && styles.heroImageMiddle,
                ]}
                resizeMode="contain"
              />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.categoryRow}>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            onPress={() => setSearchText(category)}
            accessibilityRole="button"
            style={styles.categoryItem}>
            <View style={styles.categoryIcon}>
              <Text style={styles.categoryIconText}>
                {categoryShortName(category).slice(0, 1)}
              </Text>
            </View>
            <Text style={styles.categoryText} numberOfLines={1}>
              {categoryShortName(category)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <LocationBadge />

      {scannedCode ? (
        <View>
          <View style={styles.scannedBox}>
            <View style={styles.scannedIcon}>
              <Text style={styles.scannedIconText}>✓</Text>
            </View>
            <View style={styles.scannedCopy}>
              <Text style={styles.scannedTitle}>
                Đã quét mã thành công
              </Text>
              <Text style={styles.scannedCode} numberOfLines={1}>
                {scannedCode}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Scanner')}
              accessibilityRole="button"
              style={styles.scanAgainButton}>
              <Text style={styles.scanAgainText}>Quét lại</Text>
            </TouchableOpacity>
          </View>

          {scannedProduct ? (
            <TouchableOpacity
              activeOpacity={0.92}
              onPress={() => handleProductPress(scannedProduct.id)}
              accessibilityRole="button"
              style={styles.scannedProductCard}>
              <View style={styles.scannedProductImageWrap}>
                <Image
                  source={scannedProduct.image}
                  style={styles.scannedProductImage}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.scannedProductInfo}>
                <Text style={styles.scannedProductLabel}>
                  Sản phẩm từ mã quét
                </Text>
                <Text style={styles.scannedProductName} numberOfLines={2}>
                  {scannedProduct.name}
                </Text>
                <Text style={styles.scannedProductMeta}>
                  {scannedProduct.category} · Còn {scannedProduct.stock}
                </Text>
                <Text style={styles.scannedProductPrice}>
                  {formatCurrency(scannedProduct.price)}
                </Text>
              </View>

              <View style={styles.detailPill}>
                <Text style={styles.detailPillText}>Chi tiết</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.scannedNotFoundBox}>
              <Text style={styles.scannedNotFoundTitle}>
                Chưa tìm thấy sản phẩm
              </Text>
              <Text style={styles.scannedNotFoundText}>
                Mã này đã được đọc thành công nhưng chưa có trong dữ liệu ShopAI.
              </Text>
            </View>
          )}
        </View>
      ) : null}

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Sản phẩm nổi bật</Text>
          <Text style={styles.sectionSub}>
            {filteredProducts.length} sản phẩm phù hợp
          </Text>
        </View>

        {searchText.length > 0 ? (
          <TouchableOpacity
            onPress={() => setSearchText('')}
            accessibilityRole="button">
            <Text style={styles.clearText}>Xóa lọc</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={[
        'top',
        'left',
        'right',
      ]}>
      <FlashList testID="products-list"
        data={filteredProducts}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ProductCard
            product={item}
            onPress={() =>
              handleProductPress(item.id)
            }
          />
        )}
        numColumns={2}
        refreshing={isRefetching}
        onRefresh={() => {refetch(); health.refetch();}}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={
          <View>
              <Text style={styles.devCrashText}>ShopAI v{APP_VERSION}</Text>
            {isFetchingNextPage ? (
              <ActivityIndicator
                size="small"
                color={COLORS.primary}
                style={styles.footerLoader}
              />
            ) : null}
              {ENABLE_CRASH_TEST ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Test Crashlytics (bản kiểm thử)"
                onLongPress={() => {
                  addCrashBreadcrumb('Dev: người dùng kích hoạt test crash');
                  triggerTestCrash();
                }}
                delayLongPress={2000}
                style={styles.devCrashTarget}>
                <Text style={styles.devCrashText}>
                  ShopAI v{APP_VERSION} · nhấn giữ 2 giây để test Crashlytics
                </Text>
              </Pressable>
            ) : null}
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
              style={styles.loading}
            />
          ) : isError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                {error instanceof ZodError ? 'Dữ liệu sản phẩm không hợp lệ. Vui lòng thử lại sau.' : 'Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.'}
              </Text>
              <ShopButton
                title="Thử lại"
                onPress={() => refetch()}
                style={styles.retryButton}
              />
            </View>
          ) : (
            <View style={styles.emptySearch}>
              <Text style={styles.emptySearchTitle}>
                Không tìm thấy sản phẩm
              </Text>
              <Text style={styles.emptySearchText}>
                Thử tìm bằng tên sản phẩm hoặc danh mục khác.
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

const makeStyles = (COLORS: ThemeColors) => StyleSheet.create({
  quickActions: {flexDirection: 'row', gap: 8, marginTop: 14},
  quickButton: {flex: 1, minHeight: 44, paddingHorizontal: 8},
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  listContent: {
    paddingBottom: 18,
  },

  header: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.padding,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },

  logoMark: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: COLORS.secondary,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },

  logoHandle: {
    position: 'absolute',
    top: 8,
    width: 18,
    height: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: '#FFECEE',
    zIndex: 2,
  },

  logoBag: {
    width: 32,
    height: 30,
    borderRadius: 11,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  logoIcon: {
    color: COLORS.secondary,
    fontSize: 13,
    fontWeight: '900',
  },

  logoPulse: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },

  brandName: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '900',
  },

  brandSub: {
    color: COLORS.textLight,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 1,
    textTransform: 'uppercase',
  },

  logoutButton: {
    minWidth: 66,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  logoutText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '800',
  },

  searchBox: {
    height: 48,
    borderRadius: 16,
    paddingLeft: 14,
    paddingRight: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: '#F8DDDF',
  },

  searchIcon: {
    color: COLORS.secondary,
    fontSize: 24,
    lineHeight: 26,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    paddingVertical: 0,
  },

  scanIconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F5D8DA',
  },

  scanIconText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '900',
  },

  hero: {
    marginTop: 16,
    minHeight: 150,
    borderRadius: 22,
    backgroundColor: COLORS.primarySoft,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },

  heroCopy: {
    flex: 1,
    paddingRight: 8,
  },

  heroEyebrow: {
    color: COLORS.secondary,
    fontSize: 13,
    fontWeight: '900',
  },

  heroTitle: {
    color: COLORS.text,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
    marginTop: 4,
  },

  heroDesc: {
    color: COLORS.text,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
  },

  heroButton: {
    alignSelf: 'flex-start',
    minHeight: 36,
    borderRadius: 18,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginTop: 12,
  },

  heroButtonText: {
    color: COLORS.onPrimary,
    fontSize: 13,
    fontWeight: '900',
  },

  heroImages: {
    width: 120,
    height: 118,
    position: 'relative',
  },

  heroImage: {
    position: 'absolute',
    width: 72,
    height: 88,
    right: 28,
    bottom: 4,
  },

  heroImageMiddle: {
    width: 58,
    height: 72,
    right: 0,
    bottom: 0,
  },

  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    paddingTop: 14,
    paddingBottom: 8,
    gap: 9,
  },

  categoryItem: {
    flex: 1,
    alignItems: 'center',
  },

  categoryIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F8DCDF',
  },

  categoryIconText: {
    color: COLORS.secondary,
    fontSize: 18,
    fontWeight: '900',
  },

  categoryText: {
    marginTop: 6,
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },

  scannedBox: {
    marginHorizontal: SIZES.padding,
    marginTop: 10,
    padding: 12,
    borderRadius: 18,
    backgroundColor: COLORS.successSoft,
    borderWidth: 1,
    borderColor: '#BFEFD1',
    flexDirection: 'row',
    alignItems: 'center',
  },

  scannedIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  scannedIconText: {
    color: COLORS.onPrimary,
    fontSize: 18,
    fontWeight: '900',
  },

  scannedCopy: {
    flex: 1,
  },

  scannedTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
  },

  scannedCode: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },

  scanAgainButton: {
    minHeight: 32,
    borderRadius: 16,
    paddingHorizontal: 12,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
  },

  scanAgainText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '900',
  },

  scannedProductCard: {
    marginHorizontal: SIZES.padding,
    marginTop: 10,
    padding: 12,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: '#FBD8DC',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#1E3A5F',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },

  scannedProductImageWrap: {
    width: 76,
    height: 76,
    borderRadius: 18,
    backgroundColor: COLORS.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  scannedProductImage: {
    width: '86%',
    height: '86%',
  },

  scannedProductInfo: {
    flex: 1,
    paddingRight: 8,
  },

  scannedProductLabel: {
    color: COLORS.success,
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 3,
  },

  scannedProductName: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
  },

  scannedProductMeta: {
    color: COLORS.textLight,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },

  scannedProductPrice: {
    color: COLORS.secondary,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 5,
  },

  detailPill: {
    minHeight: 32,
    borderRadius: 16,
    paddingHorizontal: 10,
    backgroundColor: COLORS.primarySoft,
    justifyContent: 'center',
  },

  detailPillText: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: '900',
  },

  scannedNotFoundBox: {
    marginHorizontal: SIZES.padding,
    marginTop: 10,
    padding: 13,
    borderRadius: 18,
    backgroundColor: COLORS.warningSoft,
    borderWidth: 1,
    borderColor: '#FFE3A3',
  },

  scannedNotFoundTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '900',
  },

  scannedNotFoundText: {
    color: COLORS.textLight,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingTop: 18,
    paddingBottom: 6,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: '900',
  },

  sectionSub: {
    color: COLORS.textLight,
    fontSize: 12,
    marginTop: 3,
  },

  clearText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '900',
  },

  loading: {
    marginTop: 32,
  },

  errorBox: {
    alignItems: 'center',
    padding: SIZES.padding,
  },

  errorText: {
    color: COLORS.error,
    textAlign: 'center',
  },

  retryButton: {
    width: 110,
    height: 40,
    marginTop: 12,
  },

  emptySearch: {
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: 64,
  },

  emptySearchTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '900',
  },

  emptySearchText: {
    color: COLORS.textLight,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },

  footerLoader: {
    marginVertical: 16,
  },
  devCrashTarget: {
    alignSelf: 'center',
    padding: 8,
    marginTop: 8,
  },
  devCrashText: {
    color: '#AAB2BF',
    fontSize: 10,
  },
});

export default HomeScreen;
