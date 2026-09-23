import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, AppState, Linking, StyleSheet, Text, View} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Camera, useCameraDevice, useCodeScanner} from 'react-native-vision-camera';

import ShopButton from '@components/ui/ShopButton';
import {COLORS} from '@constants/theme';
import {HomeStackParamList} from '../types/navigationTypes';
import {hapticSuccess} from '@utils/haptics';

type PermissionState = 'checking' | 'granted' | 'denied';

type ScannerScreenProps = NativeStackScreenProps<HomeStackParamList, 'Scanner'>;

const ScannerScreen = ({
  navigation,
}: ScannerScreenProps): React.JSX.Element => {
  const [permission, setPermission] = useState<PermissionState>('checking');
  const device = useCameraDevice('back');
  const isFocused = useIsFocused();
  const isScanning = useRef(false);

  const requestPermission = useCallback(async () => {
    const current = Camera.getCameraPermissionStatus();

    if (current === 'granted') {
      setPermission('granted');
      return;
    }

    const status = await Camera.requestCameraPermission();
    setPermission(status === 'granted' ? 'granted' : 'denied');
  }, []);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        requestPermission();
      }
    });

    return () => sub.remove();
  }, [requestPermission]);

  const openAppSettings = () => {
    Alert.alert(
      'Can quyen Camera',
      'ShopAI can Camera de quet ma vach. Hay mo Cai dat va bat lai quyen Camera.',
      [
        {text: 'De sau', style: 'cancel'},
        {text: 'Mo Cai dat', onPress: () => Linking.openSettings()},
      ],
    );
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'code-128'],
    onCodeScanned: codes => {
      if (isScanning.current || codes.length === 0) {
        return;
      }

      const value = codes[0].value;
      if (!value) {
        return;
      }

      isScanning.current = true;
      hapticSuccess();
      navigation.navigate('Home', {scannedCode: value});
    },
  });

  if (permission === 'checking') {
    return (
      <View style={styles.center}>
        <Text style={styles.stateText}>Dang kiem tra quyen Camera...</Text>
      </View>
    );
  }

  if (permission === 'denied') {
    return (
      <View style={styles.center}>
        <Text style={styles.deniedTitle}>Chua co quyen Camera</Text>
        <Text style={styles.deniedDesc}>
          ShopAI can Camera de quet ma vach san pham. Anh chi duoc xu ly
          tren may cua ban.
        </Text>
        <ShopButton
          title="Mo Cai dat"
          onPress={openAppSettings}
          style={styles.actionButton}
        />
        <ShopButton
          title="Quay lai"
          onPress={() => navigation.goBack()}
          style={[styles.actionButton, styles.secondaryButton]}
        />
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.center}>
        <Text style={styles.stateText}>Thiet bi khong co Camera sau.</Text>
        <Text style={styles.deniedDesc}>
          Hay thu tren dien thoai that de kiem tra tinh nang quet ma.
        </Text>
        <ShopButton
          title="Quay lai"
          onPress={() => navigation.goBack()}
          style={styles.actionButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        codeScanner={codeScanner}
      />

      <View style={styles.frameWrapper} pointerEvents="none">
        <View style={styles.frame} />
      </View>

      <View style={styles.overlay}>
        <Text style={styles.instruction}>Dua ma vach vao khung hinh</Text>
        <ShopButton
          title="Huy bo"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },

  stateText: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
    color: COLORS.text,
  },

  deniedTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: COLORS.error,
  },

  deniedDesc: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    color: COLORS.textLight,
  },

  actionButton: {
    width: 200,
    marginBottom: 12,
  },

  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },

  frameWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  frame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16,
  },

  overlay: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    alignItems: 'center',
  },

  instruction: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
    padding: 10,
    borderRadius: 8,
  },

  cancelButton: {
    width: 150,
    backgroundColor: COLORS.error,
  },
});

export default ScannerScreen;
