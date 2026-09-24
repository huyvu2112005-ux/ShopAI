import React, {useCallback, useState} from 'react';

import {useInfiniteQuery} from '@tanstack/react-query';

import {
  ActivityIndicator,
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
  COLORS,
  SIZES,
} from '@constants/theme';

import {fetchProductsPage} from '@services/productQuery';
import {useAuthStore} from '../store/useAuthStore';

import {
  HomeStackParamList,
} from '../types/navigationTypes';

type HomeScreenProps =
  NativeStackScreenProps<
    HomeStackParamList,
    'Home'
  >;

const HomeScreen = ({
  navigation,
  route,
}: HomeScreenProps): React.JSX.Element => {
  const logout = useAuthStore(state => state.logout);
  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['productsInfinite'],
    queryFn: fetchProductsPage,
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.nextPage,
  });

  const products = data?.pages.flatMap(page => page.items) ?? [];
  const scannedCode = route.params?.scannedCode;

  const [searchText, setSearchText] =
    useState('');

  const normalizedSearchText =
    searchText.trim().toLowerCase();

  const filteredProducts = products.filter(
    product =>
      product.name.toLowerCase().includes(normalizedSearchText) ||
      product.category.toLowerCase().includes(normalizedSearchText),
  );

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

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={[
        'top',
        'left',
        'right',
      ]}>
      <View style={styles.container}>
        <View style={styles.headerShell}>
          <View style={styles.headerTop}>
            <View style={styles.brandBlock}>
              <View style={styles.logoMark}>
                <Text style={styles.logoText}>S</Text>
              </View>

              <View style={styles.titleBlock}>
                <Text style={styles.headerTitle}>
                  ShopAI
                </Text>

                <Text style={styles.headerSubtitle}>
                  Mua sắm công nghệ thông minh
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={logout}
              accessibilityRole="button"
              style={styles.logoutPill}>
              <Text style={styles.logoutText}>Thoát</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.scanPanel}>
            <View style={styles.scanCopy}>
              <Text style={styles.scanLabel}>
                Quét mã sản phẩm
              </Text>

              <Text style={styles.scanHint}>
                Dùng camera để đọc QR hoặc mã vạch
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('Scanner')}
              accessibilityRole="button"
              style={styles.scanButton}>
              <Text style={styles.scanButtonText}>Quét mã</Text>
            </TouchableOpacity>
          </View>
        </View>

        <LocationBadge />

        {scannedCode ? (
          <View style={styles.scannedBox}>
            <View>
              <Text style={styles.scannedLabel}>Mã vừa quét</Text>
              <Text style={styles.scannedCode}>{scannedCode}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Tìm sản phẩm hoặc danh mục"
              placeholderTextColor="#99A2B0"
              style={styles.searchInput}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchText('')}
                accessibilityRole="button"
                style={styles.clearButton}>
                <Text style={styles.clearSearch}>×</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.headerTitle}>
              Sản phẩm nổi bật
            </Text>

            <Text style={styles.resultText}>
              {filteredProducts.length} phù hợp
            </Text>
          </View>
        </View>

        {isLoading && (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={styles.loading}
          />
        )}

        {isError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              Không tải được sản phẩm. Vui lòng thử lại.
            </Text>
            <ShopButton
              title="Thử lại"
              onPress={() => refetch()}
              style={styles.retryButton}
            />
          </View>
        )}

        <FlashList
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
          onRefresh={() => refetch()}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                size="small"
                color={COLORS.primary}
                style={styles.footerLoader}
              />
            ) : null
          }
          contentContainerStyle={{
            padding: SIZES.padding / 2,
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptySearch}>
              <Text style={styles.emptySearchTitle}>
                Không tìm thấy sản phẩm
              </Text>
              <Text style={styles.emptySearchText}>
                Thử tìm bằng tên sản phẩm hoặc danh mục khác.
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  headerShell: {
    backgroundColor:
      COLORS.surface,
    paddingHorizontal: SIZES.padding,
    paddingTop: 14,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1F4',
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  brandBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },

  logoMark: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  logoText: {
    color: COLORS.surface,
    fontSize: 22,
    fontWeight: '900',
  },

  titleBlock: {
    flex: 1,
  },

  headerTitle: {
    fontSize:
      SIZES.h2,
    fontWeight:
      '800',
    color:
      COLORS.text,
  },

  headerSubtitle: {
    marginTop:
      2,
    fontSize:
      13,
    color:
      '#777777',
  },

  logoutPill: {
    minWidth: 66,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFF1F1',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  logoutText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '800',
  },

  scanPanel: {
    marginTop: 16,
    borderRadius: 18,
    padding: 14,
    backgroundColor: '#F8FAFF',
    borderWidth: 1,
    borderColor: '#DDE7FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  scanCopy: {
    flex: 1,
    paddingRight: 12,
  },

  scanLabel: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '800',
  },

  scanHint: {
    marginTop: 3,
    color: COLORS.textLight,
    fontSize: 12,
    lineHeight: 17,
  },

  scanButton: {
    minWidth: 96,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  scanButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '800',
  },

  scannedBox: {
    marginHorizontal: SIZES.padding,
    marginTop: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#FFF7E6',
    borderWidth: 1,
    borderColor: '#FFD591',
  },

  scannedLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },

  scannedCode: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },

  searchSection: {
    paddingHorizontal: SIZES.padding,
    paddingTop: 14,
    paddingBottom: 6,
  },

  searchBox: {
    height: 50,
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  searchIcon: {
    color: COLORS.primary,
    fontSize: 27,
    lineHeight: 28,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    paddingVertical: 0,
  },

  clearSearch: {
    color: COLORS.textLight,
    fontSize: 26,
    lineHeight: 28,
  },

  clearButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  resultRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  resultText: {
    color: COLORS.textLight,
    fontSize: 12,
    fontWeight: '700',
  },

  emptySearch: {
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: 80,
  },

  emptySearchTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
  },

  emptySearchText: {
    color: COLORS.textLight,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
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

  footerLoader: {
    marginVertical: 16,
  },
});

export default HomeScreen;
