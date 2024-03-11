import { useTheme, useIsFocused } from '@react-navigation/native';
import { useExpoTheme } from 'expo-dev-client-components';
import * as React from 'react';
import { Platform, StatusBar } from 'react-native';

export default function ThemedStatusBar() {
  const theme = useTheme();
  const isFocused = useIsFocused();
  const expoTheme = useExpoTheme();

  const barStyle = theme.dark ? 'light-content' : 'dark-content';

  // 在从 Expo 项目切换回主页时，有时状态栏会被更改回默认状态栏。这段代码解决了这个问题，但是代码实现起来有些混乱。
  // 这段代码可能是为了解决在 Expo 项目中切换页面时可能出现的状态栏样式被更改的问题。然而，它可能不是最优雅的解决方案，并且可能存在某种混乱的代码实现。
  if (Platform.OS === 'android' && isFocused) {
    StatusBar.setBarStyle(barStyle);
  }

  return <StatusBar barStyle={barStyle} backgroundColor={expoTheme.background.default} />;
}
