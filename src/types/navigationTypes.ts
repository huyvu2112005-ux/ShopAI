import {NavigatorScreenParams} from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
};


export type HomeStackParamList = {
  Home:
    | {
        scannedCode?: string;
      }
    | undefined;

  Layout: undefined;

  ProductDetail: {
    productId: string;
  };

  Scanner: undefined;
  AIChat: undefined;
};


export type MainTabParamList = {
  AIChat: undefined;
  HomeTab: NavigatorScreenParams<HomeStackParamList> | undefined;
  Cart: undefined;
  Orders: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Checkout: undefined;
  OrderDetail: {
    orderId: string;
  };
};

export type AppDrawerParamList = {
  Shop: NavigatorScreenParams<AppStackParamList> | undefined;
  Settings: undefined;
  Practice: undefined;
};
