import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';

export default function TextInputDemo() {
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TextInput Demo</Text>

      <Text style={styles.label}>
        Nhập tên của bạn:
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập họ và tên"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.result}>
        Bạn vừa nhập: {name}
      </Text>
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
    fontSize: 30,
    fontWeight: '800',
    color: '#FF4D4F',
    textAlign: 'center',
    marginBottom: 30,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 10,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },

  result: {
    marginTop: 20,
    fontSize: 16,
    color: '#2C3E50',
  },
});