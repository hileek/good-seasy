import * as React from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';

import HomeApp from './src/HomeApp';
// import './src/menu/DevMenuApp';

if (Platform.OS === 'android') {
  enableScreens(false);
}
// SplashScreen.preventAutoHideAsync();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HomeApp />
    </GestureHandlerRootView>
  );
}
