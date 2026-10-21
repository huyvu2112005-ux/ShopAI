import {useCallback, useEffect, useState} from 'react';
import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export type Coords = {
  latitude: number;
  longitude: number;
};

type LocationState = {
  coords: Coords | null;
  loading: boolean;
  error: string | null;
};

const requestLocationPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      return true;
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'ShopAI cần quyền vị trí',
        message:
          'Cho phép ShopAI lấy vị trí để tính phí giao hàng chính xác hơn.',
        buttonPositive: 'Cho phép',
        buttonNegative: 'Để sau',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      Alert.alert(
        'Quyền vị trí đã bị chặn',
        'Hãy vào Cài đặt > ShopAI > Quyền > Vị trí để bật lại.',
        [
          {text: 'Để sau', style: 'cancel'},
          {text: 'Mở Cài đặt', onPress: () => Linking.openSettings()},
        ],
      );
      return false;
    }

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.log('[location] Location permission failed:', error);
    return false;
  }
};

export const useCurrentLocation = () => {
  const [state, setState] = useState<LocationState>({
    coords: null,
    loading: true,
    error: null,
  });

  const fetchLocation = useCallback(async () => {
    setState(current => ({...current, loading: true, error: null}));

    try {
      const permitted = await requestLocationPermission();
      if (!permitted) {
        setState({
          coords: null,
          loading: false,
          error: 'Chưa được cấp quyền vị trí',
        });
        return;
      }

      Geolocation.getCurrentPosition(
        position => {
          setState({
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            loading: false,
            error: null,
          });
        },
        error => {
          const messages: Record<number, string> = {
            1: 'Bạn đã từ chối quyền vị trí',
            2: 'Không bắt được tín hiệu GPS',
            3: 'Quá thời gian chờ GPS',
          };

          setState({
            coords: null,
            loading: false,
            error: messages[error.code] ?? 'Không lấy được vị trí',
          });
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 60000,
        },
      );
    } catch (error) {
      console.log('[location] Location fetch failed:', error);
      setState({
        coords: null,
        loading: false,
        error: 'Không lấy được vị trí',
      });
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return {...state, refresh: fetchLocation};
};
