import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

import LottieView from 'lottie-react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const LottieDemoScreen = () => {
  const handleContinue = () => {
    console.log('Đã nhấn nút Tiếp tục');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>
          Đang tải dữ liệu
        </Text>

        <Text style={styles.description}>
          Vui lòng chờ trong giây lát...
        </Text>

        <LottieView
          source={require('../assets/animations/loading.json')}
          autoPlay
          loop
          style={styles.animation}
        />

        <Pressable
          onPress={handleContinue}
          style={({pressed}) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}>
          <Text style={styles.buttonText}>
            Tiếp tục
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
  },

  description: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 8,
  },

  animation: {
    width: 180,
    height: 180,
    marginVertical: 20,
  },

  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#FF4D4F',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonPressed: {
    opacity: 0.8,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default LottieDemoScreen;