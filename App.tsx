import React from 'react';


import {
  NavigationContainer,
} from '@react-navigation/native';


import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';


import {
  Provider,
} from 'react-redux';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';


import {
  store,
} from './src/redux/store';


import AuthStackNavigator from './src/navigation/AuthStackNavigator';

import RootStackNavigator from './src/navigation/RootStackNavigator';
import {useAuthStore} from './src/store/useAuthStore';

const queryClient = new QueryClient();



function App(): React.JSX.Element {


  const userToken = useAuthStore(state => state.token);



  return (


    <Provider store={store}>


      <SafeAreaProvider>


        <QueryClientProvider client={queryClient}>

          <NavigationContainer>


          {
            userToken === null ?


            (

              <AuthStackNavigator />

            )


            :


            (

              <RootStackNavigator />

            )


          }


          </NavigationContainer>

        </QueryClientProvider>


      </SafeAreaProvider>


    </Provider>


  );

}



export default App;