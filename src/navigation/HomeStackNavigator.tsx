import React from 'react';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';


import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import LayoutScreen from '../screens/LayoutScreen';
import ScannerScreen from '../screens/ScannerScreen';


import {
  HomeStackParamList,
} from '../types/navigationTypes';



const Stack =
createNativeStackNavigator<HomeStackParamList>();



function HomeStackNavigator(): React.JSX.Element {


  return (

    <Stack.Navigator

      initialRouteName="Home"

      screenOptions={{
        headerShown:false,
      }}

    >


      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />



      <Stack.Screen

        name="Layout"

        component={LayoutScreen}

      />



      <Stack.Screen

        name="ProductDetail"

        component={ProductDetailScreen}

      />



      <Stack.Screen

        name="Scanner"

        component={ScannerScreen}

      />


    </Stack.Navigator>

  );

}


export default HomeStackNavigator;
