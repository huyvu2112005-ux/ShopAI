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
};


export type MainTabParamList = {
  HomeTab: undefined;
  Cart: undefined;
  Orders: undefined;
};

export type AppStackParamList = {
  MainTabs: undefined;
  Checkout: undefined;
  OrderDetail: {
    orderId: string;
  };
};
