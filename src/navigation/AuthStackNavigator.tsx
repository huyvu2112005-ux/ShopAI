import React from 'react';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import LoginScreen from '@screens/LoginScreen';
import RegisterScreen from '@screens/RegisterScreen';

import {
  RootStackParamList,
} from '../types/navigationTypes';

const Stack =
  createNativeStackNavigator<RootStackParamList>();

const AuthStackNavigator = (): React.JSX.Element => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login">
        {({navigation}) => (
          <LoginScreen
            onGoToRegister={() =>
              navigation.navigate('Register')
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Register">
        {({navigation}) => (
          <RegisterScreen
            onRegisterSuccess={() =>
              navigation.navigate('Login')
            }
            onGoToLogin={() =>
              navigation.navigate('Login')
            }
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;