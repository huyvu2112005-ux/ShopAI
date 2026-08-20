import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from 'react-native';

type Post = {
  id: number;
  title: string;
  body: string;
};

export default function FetchDemo() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts?_limit=10',
      );

      if (!response.ok) {
        throw new Error('Không tải được dữ liệu');
      }

      const data: Post[] = await response.json();

      setPosts(data);
    } catch (err) {
      setError('Đã xảy ra lỗi khi tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#FF4D4F"
        />

        <Text style={styles.loadingText}>
          Đang tải dữ liệu...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error}
        </Text>

        <Pressable
          style={styles.button}
          onPress={fetchPosts}>
          <Text style={styles.buttonText}>
            THỬ LẠI
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Fetch API Demo
      </Text>

      <FlatList
        data={posts}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Text style={styles.postTitle}>
              {item.title}
            </Text>

            <Text style={styles.body}>
              {item.body}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },

  center: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FF4D4F',
    textAlign: 'center',
    marginBottom: 20,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7F8C8D',
  },

  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#FF4D4F',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  postTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
  },

  body: {
    fontSize: 14,
    lineHeight: 21,
    color: '#7F8C8D',
  },
});