import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  View,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import Typography from '@components/ui/Typography';
import ShopInput from '@components/ui/ShopInput';
import ShopButton from '@components/ui/ShopButton';

import {
  fetchSamplePosts,
  PostItem,
} from '@services/productApi';

import {
  COLORS,
  SIZES,
} from '@constants/theme';

const HomeScreen = () => {
  const [keyword, setKeyword] = useState('');
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const aliveRef = useRef(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchSamplePosts();

      if (aliveRef.current) {
        setPosts(data);
      }
    } catch {
      if (aliveRef.current) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      }
    } finally {
      if (aliveRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    aliveRef.current = true;

    load();

    return () => {
      aliveRef.current = false;
    };
  }, [load]);

  const filteredPosts = posts.filter(item =>
    item.title
      .toLowerCase()
      .includes(keyword.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Typography
          variant="h1"
          color={COLORS.primary}
          style={styles.brand}>
          ShopAI
        </Typography>

        <Typography
          variant="body2"
          color={COLORS.textLight}>
          Danh sách nội dung từ API
        </Typography>
      </View>

      <Image
        source={{
          uri: 'https://picsum.photos/800/200',
        }}
        style={styles.banner}
        resizeMode="cover"
      />

      <View style={styles.controlArea}>
        <ShopInput
          label="Tìm kiếm"
          value={keyword}
          onChangeText={setKeyword}
          placeholder="Nhập tiêu đề cần tìm..."
          autoCapitalize="none"
        />

        <ShopButton
          title="Làm mới danh sách"
          onPress={load}
          loading={loading}
        />
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
          />

          <Typography
            variant="body2"
            color={COLORS.textLight}
            style={styles.loadingText}>
            Đang tải dữ liệu...
          </Typography>
        </View>
      )}

      {!loading && error && (
        <View style={styles.messageContainer}>
          <Typography
            variant="body1"
            color={COLORS.error}
            style={styles.messageText}>
            {error}
          </Typography>

          <ShopButton
            title="Thử lại"
            onPress={load}
            style={styles.retryButton}
          />
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={filteredPosts}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.messageContainer}>
              <Typography
                variant="body1"
                color={COLORS.textLight}
                style={styles.messageText}>
                Không tìm thấy kết quả phù hợp.
              </Typography>
            </View>
          }
          renderItem={({item}) => (
            <View style={styles.card}>
              <Typography
                variant="h3"
                style={styles.cardTitle}
                numberOfLines={2}>
                {item.title}
              </Typography>

              <Typography
                variant="body2"
                color={COLORS.textLight}
                numberOfLines={3}>
                {item.body}
              </Typography>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding,
    paddingBottom: 12,
  },

  brand: {
    marginBottom: 4,
  },

  banner: {
    width: '100%',
    height: 120,
    marginTop: 8,
  },

  controlArea: {
    padding: SIZES.padding,
    paddingBottom: 8,
  },

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },

  loadingText: {
    marginTop: 12,
  },

  messageContainer: {
    padding: 24,
    alignItems: 'center',
  },

  messageText: {
    textAlign: 'center',
  },

  retryButton: {
    marginTop: 16,
    width: '100%',
  },

  listContent: {
    paddingBottom: 24,
  },

  card: {
    marginHorizontal: SIZES.padding,
    marginTop: 10,
    padding: 14,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
  },

  cardTitle: {
    marginBottom: 6,
  },
});

export default HomeScreen;