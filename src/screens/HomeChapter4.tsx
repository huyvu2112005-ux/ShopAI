import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  FlashList,
} from '@shopify/flash-list';

import ProductCard from '@components/ui/ProductCard';
import {
  COLORS,
  SIZES,
} from '@constants/theme';
import {
  MOCK_PRODUCTS,
} from '@data/mockProducts';
import useDebounce from '@hooks/useDebounce';

const CATEGORIES = [
  'Tất cả',
  'Công nghệ',
  'Phụ kiện',
];

export default function HomeChapter4() {
  const [products, setProducts] =
    useState(MOCK_PRODUCTS);
  const [keyword, setKeyword] =
    useState('');
  const [selectedCategory, setSelectedCategory] =
    useState('Tất cả');
  const [refreshing, setRefreshing] =
    useState(false);
  const [filterVisible, setFilterVisible] =
    useState(false);

  const debouncedKeyword = useDebounce(
    keyword,
    500,
  );

  const filteredProducts = useMemo(() => {
    const normalizedKeyword = debouncedKeyword
      .trim()
      .toLowerCase();

    return products.filter(product => {
      const matchesKeyword = product.name
        .toLowerCase()
        .includes(normalizedKeyword);
      const matchesCategory =
        selectedCategory === 'Tất cả' ||
        product.category === selectedCategory;

      return matchesKeyword && matchesCategory;
    });
  }, [debouncedKeyword, products, selectedCategory]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setProducts(
        [...MOCK_PRODUCTS].sort(
          () => Math.random() - 0.5,
        ),
      );
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={[
        'top',
        'left',
        'right',
        'bottom',
      ]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Khám phá
          </Text>

          <TextInput
            value={keyword}
            onChangeText={setKeyword}
            placeholder="Tìm sản phẩm..."
            placeholderTextColor={COLORS.textLight}
            autoCapitalize="none"
            style={styles.searchInput}
          />

          <Pressable
            onPress={() => setFilterVisible(true)}
            style={styles.filterButton}>
            <Text style={styles.filterButtonText}>
              Bộ lọc: {selectedCategory}
            </Text>
          </Pressable>
        </View>

        <FlashList
          data={filteredProducts}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <ProductCard product={item} />
          )}
          numColumns={2}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={
            styles.listContent
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyList}
        />
      </View>

      <Modal
        visible={filterVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.filterPanel}>
            <Text style={styles.filterTitle}>
              Lọc theo danh mục
            </Text>

            {CATEGORIES.map(category => (
              <Pressable
                key={category}
                onPress={() => {
                  setSelectedCategory(category);
                  setFilterVisible(false);
                }}
                style={styles.categoryOption}>
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category &&
                      styles.categoryTextActive,
                  ]}>
                  {category}
                </Text>
              </Pressable>
            ))}

            <Pressable
              onPress={() => setFilterVisible(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>
                Đóng
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function EmptyList() {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        Không tìm thấy sản phẩm phù hợp.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
  },

  title: {
    color: COLORS.text,
    fontSize: SIZES.h1,
    fontWeight: '700',
  },

  searchInput: {
    minHeight: 48,
    marginTop: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },

  filterButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.secondary,
  },

  filterButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.small,
    fontWeight: '700',
  },

  listContent: {
    paddingHorizontal: SIZES.padding / 2,
    paddingBottom: 24,
  },

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },

  emptyText: {
    color: COLORS.textLight,
    fontSize: SIZES.body1,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },

  filterPanel: {
    padding: SIZES.padding,
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
    backgroundColor: COLORS.surface,
  },

  filterTitle: {
    marginBottom: 12,
    color: COLORS.text,
    fontSize: SIZES.h2,
    fontWeight: '700',
  },

  categoryOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  categoryText: {
    color: COLORS.text,
    fontSize: SIZES.body1,
  },

  categoryTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },

  closeButton: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.primary,
  },

  closeButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.body1,
    fontWeight: '700',
  },
});