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
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>
              ShopAI
            </Text>

            <Text style={styles.headerSubtitle}>
              Khám phá sản phẩm công nghệ
            </Text>
          </View>

          <View style={styles.headerActions}>
            <ShopButton
              title="Quét mã"
              onPress={() => navigation.navigate('Scanner')}
              style={styles.scanButton}
            />

            <ShopButton
              title="Thoát"
              onPress={logout}
              style={styles.logoutButton}
            />
          </View>
        </View>

        <LocationBadge />

        {scannedCode ? (
          <View style={styles.scannedBox}>
            <Text style={styles.scannedLabel}>Mã vừa quét</Text>
            <Text style={styles.scannedCode}>{scannedCode}</Text>
          </View>
        ) : null}

        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Tìm sản phẩm hoặc danh mục"
              placeholderTextColor="#9AA3AF"
              style={styles.searchInput}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchText('')}
                accessibilityRole="button">
                <Text style={styles.clearSearch}>×</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.resultText}>
            {filteredProducts.length} sản phẩm phù hợp
          </Text>
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingHorizontal:
      SIZES.padding,
    paddingVertical:
      15,

    backgroundColor:
      COLORS.surface,
  },

  headerTitle: {
    fontSize:
      SIZES.h1,
    fontWeight:
      'bold',
    color:
      COLORS.text,
  },

  headerSubtitle: {
    marginTop:
      4,
    fontSize:
      13,
    color:
      '#777777',
  },

  logoutButton: {
    width: 80,
    height: 36,
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  scanButton: {
    width: 92,
    height: 36,
    backgroundColor: COLORS.secondary,
  },

  scannedBox: {
    marginHorizontal: SIZES.padding,
    marginTop: 10,
    padding: 12,
    borderRadius: SIZES.radius,
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
    paddingTop: 12,
    paddingBottom: 4,
  },

  searchBox: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 12,
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
    paddingLeft: 8,
  },

  resultText: {
    color: COLORS.textLight,
    fontSize: 12,
    marginTop: 8,
    marginLeft: 2,
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
