import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import RootStackNavigator from './RootStackNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import PracticeScreen from '../screens/PracticeScreen';
import {AppDrawerParamList} from '../types/navigationTypes';
import {useThemeColors} from '../contexts/ThemeContext';

const Drawer = createDrawerNavigator<AppDrawerParamList>();
export default function MainDrawerNavigator() {
  const colors = useThemeColors();
  return <Drawer.Navigator screenOptions={{drawerActiveTintColor: colors.primary, drawerStyle: {backgroundColor: colors.surface}, headerTintColor: colors.text, headerStyle: {backgroundColor: colors.surface}}}>
    <Drawer.Screen name="Shop" component={RootStackNavigator} options={{title: 'Mua sắm', headerShown: false}} />
    <Drawer.Screen name="Settings" component={SettingsScreen} options={{title: 'Cài đặt'}} />
    {__DEV__ && <Drawer.Screen name="Practice" component={PracticeScreen} options={{title: 'Bài thực hành'}} />}
  </Drawer.Navigator>;
}
