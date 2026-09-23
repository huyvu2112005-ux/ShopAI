import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import MainTabNavigator from './MainTabNavigator';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import {AppStackParamList} from '../types/navigationTypes';

const Stack = createNativeStackNavigator<AppStackParamList>();

function RootStackNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{presentation: 'modal', headerShown: true, title: 'Thanh toán'}}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{headerShown: true, title: 'Chi tiết hóa đơn'}}
      />
    </Stack.Navigator>
  );
}

export default RootStackNavigator;
