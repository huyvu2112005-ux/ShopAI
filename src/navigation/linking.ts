import {LinkingOptions} from '@react-navigation/native';
import {AppDrawerParamList} from '../types/navigationTypes';
export const linking: LinkingOptions<AppDrawerParamList> = {
  prefixes: ['shopai://'],
  config: {screens: {
    Shop: {screens: {MainTabs: {screens: {HomeTab: {initialRouteName: 'Home', screens: {
      Home: '', ProductDetail: 'product/:productId', AIChat: 'ai',
    }}}}}},
    Settings: 'settings',
  }},
};
