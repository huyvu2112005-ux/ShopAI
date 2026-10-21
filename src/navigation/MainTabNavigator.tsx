import React from 'react';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeStackNavigator from './HomeStackNavigator';
import CartScreen from '../screens/CartScreen';
import OrdersScreen from '../screens/OrdersScreen';
import AIChatScreen from '../screens/AIChatScreen';
import {useThemeColors} from '../contexts/ThemeContext';

import {
  MainTabParamList,
} from '../types/navigationTypes';

import {useCartStore} from '../store/useCartStore';

const Tab =
  createBottomTabNavigator<MainTabParamList>();

type TabIconProps = {
  color: string;
  size: number;
};

const HomeIcon = ({color, size}: TabIconProps) => (
  <Icon name="home-variant-outline" color={color} size={size} />
);

const CartIcon = ({color, size}: TabIconProps) => (
  <Icon name="cart-outline" color={color} size={size} />
);

const OrdersIcon = ({color, size}: TabIconProps) => (
  <Icon name="receipt" color={color} size={size} />
);
const ChatIcon = ({color, size}: TabIconProps) => (
  <Icon name="robot-outline" color={color} size={size} />
);

const MainTabNavigator = (): React.JSX.Element => {
  const COLORS = useThemeColors();
  const cartBadgeCount = useCartStore(state => state.totalQuantity());

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
      }}>
      <Tab.Screen
        name="HomeTab"
        options={({route}) => ({
          title: 'Trang chủ',

          tabBarIcon: HomeIcon,
          tabBarStyle:
            getFocusedRouteNameFromRoute(route) === 'Scanner'
              ? {display: 'none'}
              : undefined,
        })}>
        {() => (
          <HomeStackNavigator />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Giỏ hàng',

          tabBarIcon: CartIcon,

          tabBarBadge:
            cartBadgeCount > 0
              ? cartBadgeCount
              : undefined,
        }}
      />

      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          title: 'Đơn hàng',
          tabBarIcon: OrdersIcon,
        }}
      />
      <Tab.Screen name="AIChat" component={AIChatScreen} options={{title: 'Trợ lý AI', tabBarIcon: ChatIcon}} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
