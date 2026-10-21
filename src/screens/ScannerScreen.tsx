import {useThemedStyles} from '../hooks/useThemedStyles';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  AppState,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Camera, useCameraDevice, useCodeScanner} from 'react-native-vision-camera';

import ShopButton from '@components/ui/ShopButton';
import {ThemeColors} from '@constants/theme';
import {HomeStackParamList} from '../types/navigationTypes';
import {hapticSuccess} from '@utils/haptics';

type PermissionState = 'checking' | 'granted' | 'denied';

type ScannerScreenProps = NativeStackScreenProps<HomeStackParamList, 'Scanner'>;

const ScannerScreen = ({
  navigation,
}: ScannerScreenProps): React.JSX.Element => {
  const {styles} = useThemedStyles(makeStyles);

  const [permission, setPermission] = useState<PermissionState>('checking');
  const [torchEnabled, setTorchEnabled] = useState(false);
  const device = useCameraDevice('back');
  const isFocused = useIsFocused();
  const [appState, setAppState] = useState(AppState.currentState);
  const isScanning = useRef(false);
  const scanLockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const requestPermission = useCallback(async () => {
    try {
      const current = Camera.getCameraPermissionStatus();

      if (current === 'granted') {
        setPermission('granted');
        return;
      }

      const status = await Camera.requestCameraPermission();
      setPermission(status === 'granted' ? 'granted' : 'denied');
    } catch (error) {
      console.log('[scanner] Camera permission failed:', error);
      setPermission('denied');
    }
  }, []);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', nextState => {
      setAppState(nextState);
      if (nextState === 'active') {
        requestPermission();
      }
    });

    return () => sub.remove();
  }, [requestPermission]);

  useEffect(() => {
    return () => {
      if (scanLockTimer.current) {
        clearTimeout(scanLockTimer.current);
      }
    };
  }, []);

  const openAppSettings = () => {
    Linking.openSettings().catch(error => {
      console.log('[scanner] Open settings failed:', error);
    });
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
      scanLockTimer.current = setTimeout(() => {
        isScanning.current = false;
      }, 1500);

      hapticSuccess();
      navigation.navigate('Home', {scannedCode: value});
    },
  });

  if (permission === 'checking') {
    return (
      <View style={styles.center}>
        <Text style={styles.stateTitle}>Đang kiểm tra Camera</Text>
        <Text style={styles.stateText}>
          ShopAI cần quyền Camera để quét QR hoặc mã vạch sản phẩm.
        </Text>
      </View>
    );
  }

  if (permission === 'denied') {
    return (
      <View style={styles.center}>
        <View style={styles.permissionIcon}>
          <Text style={styles.permissionIconText}>!</Text>
        </View>
        <Text style={styles.deniedTitle}>Chưa có quyền Camera</Text>
        <Text style={styles.deniedDesc}>
          Hãy bật quyền Camera để ShopAI quét mã sản phẩm thật. Nếu vừa cấp
          quyền trong Cài đặt, quay lại app sẽ tự kiểm tra lại.
        </Text>
        <ShopButton
          title="Mở Cài đặt"
          onPress={openAppSettings}
          style={styles.actionButton}
        />
        <ShopButton
          title="Quay lại"
          onPress={() => navigation.goBack()}
          style={[styles.actionButton, styles.secondaryButton]}
        />
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.center}>
        <Text style={styles.stateTitle}>Không có Camera sau</Text>
        <Text style={styles.stateText}>
          Hãy thử trên điện thoại thật để kiểm tra tính năng quét mã.
        </Text>
        <ShopButton
          title="Quay lại"
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
          isActive={isFocused && appState === 'active'}
        codeScanner={codeScanner}
        torch={torchEnabled ? 'on' : 'off'}
      />

      <View style={styles.dimTop} pointerEvents="none" />
      <View style={styles.dimBottom} pointerEvents="none" />

      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          style={styles.circleButton}>
          <Text style={styles.circleText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.topCopy}>
          <Text style={styles.screenTitle}>Quét mã sản phẩm</Text>
          <Text style={styles.screenSubtitle}>
            Di chuyển camera để đọc QR hoặc mã vạch
          </Text>
        </View>

        <TouchableOpacity
          disabled={!device.hasTorch}
          onPress={() => setTorchEnabled(value => !value)}
          accessibilityRole="button"
          style={[
            styles.circleButton,
            torchEnabled && styles.circleButtonActive,
            !device.hasTorch && styles.circleButtonDisabled,
          ]}>
          <Text style={styles.torchText}>⚡</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.frameWrapper} pointerEvents="none">
        <View style={styles.frame}>
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
          <View style={styles.scanLine} />
        </View>
      </View>

      <View style={styles.bottomPanel}>
        <View style={styles.statusPill}>
          <Text style={styles.statusText}>Đang chờ mã...</Text>
        </View>

        <View style={styles.controlRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            style={styles.controlButton}>
            <Text style={styles.controlIcon}>×</Text>
            <Text style={styles.controlLabel}>Hủy</Text>
          </TouchableOpacity>

          <View style={styles.mainScanButton}>
            <Text style={styles.mainScanText}>QR</Text>
          </View>

          <TouchableOpacity
            disabled={!device.hasTorch}
            onPress={() => setTorchEnabled(value => !value)}
            accessibilityRole="button"
            style={styles.controlButton}>
            <Text style={styles.controlIcon}>⚡</Text>
            <Text style={styles.controlLabel}>Đèn pin</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const makeStyles = (COLORS: ThemeColors) => StyleSheet.create({
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

  stateTitle: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },

  stateText: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    color: COLORS.textLight,
    marginBottom: 20,
  },

  permissionIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  permissionIconText: {
    color: COLORS.primary,
    fontSize: 30,
    fontWeight: '900',
  },

  deniedTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 10,
    color: COLORS.text,
    textAlign: 'center',
  },

  deniedDesc: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 21,
    color: COLORS.textLight,
  },

  actionButton: {
    width: 210,
    marginBottom: 12,
  },

  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },

  dimTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },

  dimBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 230,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  topBar: {
    position: 'absolute',
    top: 44,
    left: 18,
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  circleButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  circleButtonActive: {
    backgroundColor: COLORS.secondary,
  },

  circleButtonDisabled: {
    opacity: 0.45,
  },

  circleText: {
    color: COLORS.onPrimary,
    fontSize: 34,
    lineHeight: 36,
    fontWeight: '300',
  },

  torchText: {
    color: COLORS.onPrimary,
    fontSize: 18,
    fontWeight: '900',
  },

  topCopy: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  screenTitle: {
    color: COLORS.onPrimary,
    fontSize: 18,
    fontWeight: '900',
  },

  screenSubtitle: {
    color: 'rgba(255,255,255,0.84)',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
  },

  corner: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderColor: '#5EC7FF',
  },

  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 18,
  },

  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 18,
  },

  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 18,
  },

  cornerBottomRight: {
    right: 0,
    bottom: 0,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderBottomRightRadius: 18,
  },

  scanLine: {
    width: 220,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#6BD4FF',
    shadowColor: '#6BD4FF',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 6,
  },

  bottomPanel: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 34,
    alignItems: 'center',
  },

  statusPill: {
    minHeight: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.48)',
    paddingHorizontal: 18,
    justifyContent: 'center',
    marginBottom: 18,
  },

  statusText: {
    color: COLORS.onPrimary,
    fontSize: 13,
    fontWeight: '800',
  },

  controlRow: {
    width: '100%',
    minHeight: 112,
    borderRadius: 28,
    backgroundColor: 'rgba(20,20,20,0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },

  controlButton: {
    width: 72,
    alignItems: 'center',
  },

  controlIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.12)',
    color: COLORS.onPrimary,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 44,
  },

  controlLabel: {
    color: COLORS.onPrimary,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 7,
  },

  mainScanButton: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: 'rgba(255,255,255,0.22)',
  },

  mainScanText: {
    color: COLORS.onPrimary,
    fontSize: 19,
    fontWeight: '900',
  },
});

export default ScannerScreen;
