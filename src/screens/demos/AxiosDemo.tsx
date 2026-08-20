import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import axios from 'axios';

type Post = {
  id: number;
  title: string;
  body: string;
};

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
});

async function loadPosts(): Promise<Post[]> {
  const response = await api.get<Post[]>('/posts', {
    params: {
      _limit: 5,
    },
  });

  return response.data;
}

export default function AxiosDemo() {
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await loadPosts();
      setItems(data);
    } catch {
      setError(
        'Không tải được dữ liệu. Kiểm tra mạng hoặc URL.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let alive = true;

    const start = async () => {
      try {
        const data = await loadPosts();

        if (alive) {
          setItems(data);
        }
      } catch {
        if (alive) {
          setError(
            'Không tải được dữ liệu. Kiểm tra mạng hoặc URL.',
          );
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    start();

    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#FF4D4F"
        />

        <Text style={styles.hint}>
          Đang tải dữ liệu bằng Axios...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          {error}
        </Text>

        <Pressable
          style={styles.button}
          onPress={load}>
          <Text style={styles.buttonText}>
            THỬ LẠI
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={item => String(item.id)}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <Text style={styles.header}>
          Axios Demo
        </Text>
      }
      renderItem={({item}) => (
        <View style={styles.card}>
          <Text style={styles.title}>
            {item.title}
          </Text>

          <Text style={styles.body}>
            {item.body}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F5F5F5',
  },

  hint: {
    marginTop: 12,
    color: '#7F8C8D',
  },

  error: {
    color: '#FF4D4F',
    textAlign: 'center',
    marginBottom: 16,
  },

  button: {
    backgroundColor: '#FF4D4F',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  list: {
    padding: 16,
    backgroundColor: '#F5F5F5',
  },

  header: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FF4D4F',
    textAlign: 'center',
    marginBottom: 16,
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
  },

  body: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: '#7F8C8D',
  },
});