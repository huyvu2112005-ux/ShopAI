import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

type ProductItem = {
  id: number;
  title: string;
  body: string;
};

const CATEGORIES = [
  'Tất cả',
  'AI Gợi ý',
  'Công nghệ',
  'Xu hướng',
];

export default function HomeChapter2Pro() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState('Tất cả');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts?_limit=12',
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: ProductItem[] = await response.json();

      setProducts(data);
    } catch {
      setError(
        'Không thể tải dữ liệu. Vui lòng kiểm tra kết nối mạng.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedKeyword =
      keyword.trim().toLowerCase();

    if (!normalizedKeyword) {
      return products;
    }

    return products.filter(item =>
      item.title
        .toLowerCase()
        .includes(normalizedKeyword),
    );
  }, [keyword, products]);

  const renderProduct = ({
    item,
    index,
  }: {
    item: ProductItem;
    index: number;
  }) => {
    const imageId = (index % 10) + 20;

    return (
      <Pressable
        style={({pressed}) => [
          styles.productCard,
          pressed && styles.productCardPressed,
        ]}>
        <Image
          source={{
            uri: `https://picsum.photos/id/${imageId}/500/350`,
          }}
          style={styles.productImage}
        />

        <View style={styles.productContent}>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>
              AI PICK
            </Text>
          </View>

          <Text
            numberOfLines={2}
            style={styles.productTitle}>
            {item.title}
          </Text>

          <Text
            numberOfLines={2}
            style={styles.productDescription}>
            {item.body}
          </Text>

          <View style={styles.productFooter}>
            <Text style={styles.productPrice}>
              {(199000 + item.id * 17000)
                .toLocaleString('vi-VN')}
              đ
            </Text>

            <View style={styles.scoreBox}>
              <Text style={styles.scoreText}>
                ✦ 9.{item.id % 10}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <FlatList
        data={
          loading || error
            ? []
            : filteredProducts
        }
        keyExtractor={item => String(item.id)}
        renderItem={renderProduct}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={
          styles.columnWrapper
        }
        contentContainerStyle={
          styles.listContent
        }
        ListHeaderComponent={
          <>
            <View style={styles.hero}>
              <View style={styles.topBar}>
                <View>
                  <Text style={styles.eyebrow}>
                    SHOPAI / DISCOVER
                  </Text>

                  <Text style={styles.brand}>
                    Khám phá thông minh
                  </Text>
                </View>

                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    AI
                  </Text>
                </View>
              </View>

              <Text style={styles.heroTitle}>
                Tìm thứ bạn cần,
                {'\n'}
                trước cả khi bạn nghĩ tới.
              </Text>

              <Text style={styles.heroDescription}>
                Dữ liệu, xu hướng và gợi ý được
                tổng hợp để tạo trải nghiệm mua
                sắm thông minh hơn.
              </Text>

              <View style={styles.searchBox}>
                <Text style={styles.searchIcon}>
                  ⌕
                </Text>

                <TextInput
                  value={keyword}
                  onChangeText={setKeyword}
                  placeholder="Tìm sản phẩm, ý tưởng..."
                  placeholderTextColor="#6E7581"
                  style={styles.searchInput}
                  autoCapitalize="none"
                />

                {keyword.length > 0 && (
                  <Pressable
                    onPress={() =>
                      setKeyword('')
                    }
                    style={styles.clearButton}>
                    <Text style={styles.clearText}>
                      ×
                    </Text>
                  </Pressable>
                )}
              </View>

              <View style={styles.metricRow}>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>
                    12
                  </Text>
                  <Text style={styles.metricLabel}>
                    Gợi ý mới
                  </Text>
                </View>

                <View style={styles.metricDivider} />

                <View style={styles.metric}>
                  <Text style={styles.metricValue}>
                    9.8
                  </Text>
                  <Text style={styles.metricLabel}>
                    AI Score
                  </Text>
                </View>

                <View style={styles.metricDivider} />

                <View style={styles.metric}>
                  <Text style={styles.metricValue}>
                    24/7
                  </Text>
                  <Text style={styles.metricLabel}>
                    Phân tích
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionEyebrow}>
                    PERSONALIZED FEED
                  </Text>

                  <Text style={styles.sectionTitle}>
                    Dành cho bạn
                  </Text>
                </View>

                <Pressable
                  onPress={loadProducts}
                  style={styles.refreshButton}>
                  <Text style={styles.refreshText}>
                    ↻
                  </Text>
                </Pressable>
              </View>

              <FlatList
                horizontal
                data={CATEGORIES}
                keyExtractor={item => item}
                showsHorizontalScrollIndicator={
                  false
                }
                contentContainerStyle={
                  styles.categoryList
                }
                renderItem={({item}) => {
                  const selected =
                    selectedCategory === item;

                  return (
                    <Pressable
                      onPress={() =>
                        setSelectedCategory(item)
                      }
                      style={[
                        styles.categoryChip,
                        selected &&
                          styles.categoryChipActive,
                      ]}>
                      <Text
                        style={[
                          styles.categoryText,
                          selected &&
                            styles.categoryTextActive,
                        ]}>
                        {item}
                      </Text>
                    </Pressable>
                  );
                }}
              />

              {loading && (
                <View style={styles.stateBox}>
                  <ActivityIndicator
                    size="large"
                    color="#73F2C7"
                  />

                  <Text style={styles.stateTitle}>
                    AI đang tổng hợp dữ liệu
                  </Text>

                  <Text style={styles.stateText}>
                    Hệ thống đang tạo danh sách
                    phù hợp cho bạn...
                  </Text>
                </View>
              )}

              {!loading && error && (
                <View style={styles.stateBox}>
                  <Text style={styles.errorIcon}>
                    !
                  </Text>

                  <Text style={styles.stateTitle}>
                    Mất kết nối dữ liệu
                  </Text>

                  <Text style={styles.stateText}>
                    {error}
                  </Text>

                  <Pressable
                    onPress={loadProducts}
                    style={styles.retryButton}>
                    <Text style={styles.retryText}>
                      Thử lại
                    </Text>
                  </Pressable>
                </View>
              )}

              {!loading &&
                !error &&
                filteredProducts.length === 0 && (
                  <View style={styles.stateBox}>
                    <Text style={styles.stateTitle}>
                      Không tìm thấy kết quả
                    </Text>

                    <Text style={styles.stateText}>
                      Hãy thử một từ khóa khác.
                    </Text>
                  </View>
                )}
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#06070A',
  },

  listContent: {
    paddingBottom: 40,
    backgroundColor: '#0B0D11',
  },

  hero: {
    backgroundColor: '#06070A',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 24,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  eyebrow: {
    color: '#73F2C7',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.6,
  },

  brand: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#151921',
    borderWidth: 1,
    borderColor: '#29313D',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#73F2C7',
    fontWeight: '900',
    fontSize: 13,
  },

  heroTitle: {
    marginTop: 34,
    color: '#F8FAFC',
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: -1,
  },

  heroDescription: {
    marginTop: 14,
    color: '#8F97A4',
    fontSize: 14,
    lineHeight: 21,
    maxWidth: 330,
  },

  searchBox: {
    marginTop: 26,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#11151B',
    borderWidth: 1,
    borderColor: '#202732',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  searchIcon: {
    color: '#73F2C7',
    fontSize: 25,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 15,
  },

  clearButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1C222B',
    justifyContent: 'center',
    alignItems: 'center',
  },

  clearText: {
    color: '#98A2B3',
    fontSize: 21,
  },

  metricRow: {
    marginTop: 24,
    backgroundColor: '#0D1015',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#171D25',
  },

  metric: {
    flex: 1,
    alignItems: 'center',
  },

  metricValue: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '900',
  },

  metricLabel: {
    color: '#646D7A',
    fontSize: 10,
    marginTop: 4,
  },

  metricDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#202630',
  },

  section: {
    paddingTop: 24,
    backgroundColor: '#0B0D11',
  },

  sectionHeader: {
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionEyebrow: {
    color: '#5E6673',
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: '800',
  },

  sectionTitle: {
    marginTop: 3,
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '900',
  },

  refreshButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#13171D',
    borderWidth: 1,
    borderColor: '#202630',
    justifyContent: 'center',
    alignItems: 'center',
  },

  refreshText: {
    color: '#73F2C7',
    fontSize: 22,
  },

  categoryList: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
  },

  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#12161C',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#1C222B',
  },

  categoryChipActive: {
    backgroundColor: '#73F2C7',
    borderColor: '#73F2C7',
  },

  categoryText: {
    color: '#8A929F',
    fontSize: 12,
    fontWeight: '700',
  },

  categoryTextActive: {
    color: '#07110E',
  },

  columnWrapper: {
    paddingHorizontal: 14,
  },

  productCard: {
    flex: 1,
    backgroundColor: '#12161C',
    margin: 5,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1B222C',
  },

  productCardPressed: {
    opacity: 0.8,
    transform: [{scale: 0.98}],
  },

  productImage: {
    width: '100%',
    height: 130,
    backgroundColor: '#1757c4',
  },

  productContent: {
    padding: 12,
  },

  aiBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#152921',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 7,
  },

  aiBadgeText: {
    color: '#73F2C7',
    fontSize: 8,
    letterSpacing: 1,
    fontWeight: '900',
  },

  productTitle: {
    marginTop: 10,
    color: '#F5F7FA',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    textTransform: 'capitalize',
  },

  productDescription: {
    color: '#747D89',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 7,
  },

  productFooter: {
    marginTop: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  productPrice: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  scoreBox: {
    backgroundColor: '#f5f7f9',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },

  scoreText: {
    color: '#73F2C7',
    fontSize: 9,
    fontWeight: '800',
  },

  stateBox: {
    marginHorizontal: 18,
    marginTop: 20,
    paddingVertical: 38,
    paddingHorizontal: 20,
    backgroundColor: '#2d5fab',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eff1f4',
    alignItems: 'center',
  },

  stateTitle: {
    marginTop: 14,
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },

  stateText: {
    marginTop: 7,
    color: '#757E8B',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },

  errorIcon: {
    color: '#FF5B5B',
    fontSize: 28,
    fontWeight: '900',
  },

  retryButton: {
    marginTop: 18,
    height: 44,
    paddingHorizontal: 25,
    borderRadius: 13,
    backgroundColor: '#73F2C7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  retryText: {
    color: '#e4edeb',
    fontSize: 13,
    fontWeight: '900',
  },
});