import React from 'react';

import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import HomeChapter4 from '@screens/HomeChapter4';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <HomeChapter4 />
    </SafeAreaProvider>
  );
}

export default App;