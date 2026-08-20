import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from 'react-native';

export default function PressableDemo() {
  const [message, setMessage] = useState('Chưa nhấn nút');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Button / TouchableOpacity / Pressable
      </Text>

      <Text style={styles.message}>
        {message}
      </Text>

      <View style={styles.item}>
        <Text style={styles.label}>1. Button</Text>

        <Button
          title="Nhấn Button"
          onPress={() => setMessage('Bạn vừa nhấn Button')}
        />
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>2. TouchableOpacity</Text>

        <TouchableOpacity
          style={styles.touchableButton}
          onPress={() =>
            setMessage('Bạn vừa nhấn TouchableOpacity')
          }>
          <Text style={styles.buttonText}>
            Nhấn TouchableOpacity
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>3. Pressable</Text>

        <Pressable
          onPress={() =>
            setMessage('Bạn vừa nhấn Pressable')
          }
          onLongPress={() =>
            setMessage('Bạn vừa nhấn giữ Pressable')
          }
          style={({pressed}) => [
            styles.pressableButton,
            pressed && styles.pressedButton,
          ]}>
          <Text style={styles.buttonText}>
            Nhấn Pressable
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 24,
    justifyContent: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 24,
  },

  message: {
    fontSize: 16,
    color: '#FF4D4F',
    textAlign: 'center',
    marginBottom: 30,
  },

  item: {
    marginBottom: 24,
  },

  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 10,
  },

  touchableButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  pressableButton: {
    backgroundColor: '#FF4D4F',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  pressedButton: {
    opacity: 0.5,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});