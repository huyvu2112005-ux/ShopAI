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
  if (Platform.OS === 'ios') {
    Geolocation.requestAuthorization();
    return true;
  }

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'ShopAI can quyen vi tri',
      message: 'Cho phep ShopAI lay vi tri de tinh phi giao hang chinh xac.',
      buttonPositive: 'Cho phep',
      buttonNegative: 'De sau',
    },
  );

  if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    Alert.alert(
      'Quyen vi tri da bi chan',
      'Hay vao Cai dat > ShopAI > Quyen > Vi tri de bat lai.',
      [
        {text: 'De sau', style: 'cancel'},
        {text: 'Mo Cai dat', onPress: () => Linking.openSettings()},
      ],
    );
    return false;
  }

  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

export const useCurrentLocation = () => {
  const [state, setState] = useState<LocationState>({
    coords: null,
    loading: true,
    error: null,
  });

  const fetchLocation = useCallback(async () => {
    setState(current => ({...current, loading: true, error: null}));

    const permitted = await requestLocationPermission();
    if (!permitted) {
      setState({
        coords: null,
        loading: false,
        error: 'Chua duoc cap quyen vi tri',
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
          1: 'Ban da tu choi quyen vi tri',
          2: 'Khong bat duoc tin hieu GPS',
          3: 'Qua thoi gian cho GPS',
        };

        setState({
          coords: null,
          loading: false,
          error: messages[error.code] ?? 'Khong lay duoc vi tri',
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 60000,
      },
    );
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return {...state, refresh: fetchLocation};
};
