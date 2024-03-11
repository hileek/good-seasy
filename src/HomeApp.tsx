import { darkTheme, lightTheme } from '@expo/styleguide-native';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import MaterialIcons from '@expo/vector-icons/build/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { Assets as StackAssets } from '@react-navigation/elements';
import { Asset } from 'expo-asset';
// import { ThemePreference, ThemeProvider } from 'expo-dev-client-components';
import * as Font from 'expo-font';
// import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { Linking, Platform, StyleSheet, View, useColorScheme } from 'react-native';
import url from 'url';
import { ColorTheme } from './constants/Colors';
import Navigation from './navigation/Navigation';

Asset.loadAsync(StackAssets);

// 货易

export default function HomeApp() {
  const colorScheme = useColorScheme();

  return (
      <View style={styles.container}>
        <Navigation theme={ColorTheme.LIGHT} />
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
