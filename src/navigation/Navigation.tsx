import {
  NavigationContainer,
  useTheme,
  RouteProp,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { HomeFilledIcon, SettingsFilledIcon } from '@expo/styleguide-native';
import { createStackNavigator, TransitionPresets, TransitionPreset } from '@react-navigation/stack';
import * as React from 'react';
import { Platform, StyleSheet, Linking } from 'react-native';
import BottomTab, { getNavigatorProps } from './BottomTabNavigator';
import Themes from '../constants/Themes';
import { ColorTheme } from '../constants/Colors';
import defaultNavigationOptions from './defaultNavigationOptions';
import {
  alertWithCameraPermissionInstructions,
  requestCameraPermissionsAsync,
} from '../utils/PermissionUtils';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BarCodeScanner from '../screens/BarCodeScanner';
import { HomeStackRoutes, SettingsStackRoutes, ModalStackRoutes } from './Navigation.types';
import NewGoodsScreen from '../screens/NewGoodsScreen';

const HomeStack = createStackNavigator<HomeStackRoutes>();
const SettingsStack = createStackNavigator<SettingsStackRoutes>();

const shouldDetachInactiveScreens = Platform.OS !== 'android';

function useThemeName() {
  const theme = useTheme();
  return theme.dark ? ColorTheme.DARK : ColorTheme.LIGHT;
}

// 自定义过渡动画
const slideFromRightTransition: Omit<TransitionPreset, 'headerStyleInterpolator'> = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: { animation: 'timing', config: { duration: 300 } },
    close: { animation: 'timing', config: { duration: 300 } },
  },
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};

function HomeStackScreen() {
  const themeName = useThemeName();

  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      detachInactiveScreens={shouldDetachInactiveScreens}
      screenOptions={defaultNavigationOptions(themeName)}>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        // options={{
        //   headerShown: false,
        // }}
      />
    </HomeStack.Navigator>
  );
}

function SettingsStackScreen() {
  const themeName = useThemeName();

  return (
    <SettingsStack.Navigator
      initialRouteName="Settings"
      detachInactiveScreens={shouldDetachInactiveScreens}
      screenOptions={defaultNavigationOptions(themeName)}>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
    </SettingsStack.Navigator>
  );
}

const RootStack = createStackNavigator();

function TabNavigator(props: { theme: string }) {
  return (
    <BottomTab.Navigator
      {...getNavigatorProps(props)}
      initialRouteName="HomeStack"
      detachInactiveScreens={shouldDetachInactiveScreens}>
      <BottomTab.Screen
        name="HomeStack"
        component={HomeStackScreen}
        options={{
          tabBarIcon: ({ color }) => <HomeFilledIcon style={styles.icon} color={color} size={24} />,
          tabBarLabel: 'Home',
        }}
      />

      {/* {Platform.OS === 'ios' && (
        <BottomTab.Screen
          name="DiagnosticsStack"
          component={DiagnosticsStackScreen}
          options={{
          tabBarIcon: () => <></>,
            tabBarLabel: 'Diagnostics',
          }}
        />
      )} */}
      <BottomTab.Screen
        name="SettingsScreen"
        component={SettingsStackScreen}
        options={{
          title: 'Settings',
          tabBarIcon: (props) => <SettingsFilledIcon {...props} style={styles.icon} size={24} />,
          tabBarLabel: 'Settings',
        }}
      />
    </BottomTab.Navigator>
  );
}

const ModalStack = createStackNavigator<ModalStackRoutes>();

export default (props: { theme: ColorTheme }) => {
  const navigationRef = useNavigationContainerRef<ModalStackRoutes>();
  const isNavigationReadyRef = React.useRef(false);
  const initialURLWasConsumed = React.useRef(false);

  React.useEffect(() => {
    const handleDeepLinks = async ({ url }: { url: string | null }) => {
      if (Platform.OS === 'ios' || !url || !isNavigationReadyRef.current) {
        return;
      }
      const nav = navigationRef.current;
      if (!nav) {
        return;
      }

      if (url.startsWith('expo-home://qr-scanner')) {
        if (await requestCameraPermissionsAsync()) {
          nav.navigate({ key: 'BarCode '});
        } else {
          await alertWithCameraPermissionInstructions();
        }
      }
    };
    if (!initialURLWasConsumed.current) {
      initialURLWasConsumed.current = true;
      Linking.getInitialURL().then((url) => {
        handleDeepLinks({ url });
      });
    }

    const deepLinkSubscription = Linking.addEventListener('url', handleDeepLinks);

    return () => {
      isNavigationReadyRef.current = false;
      deepLinkSubscription.remove();
    };
  }, []);

  return (
    <NavigationContainer
      theme={Themes[props.theme]}
      ref={navigationRef}
      onReady={() => {
        isNavigationReadyRef.current = true;
      }}
    >
      <ModalStack.Navigator
        initialRouteName="RootStack"
        detachInactiveScreens={shouldDetachInactiveScreens}
        screenOptions={({ route, navigation }) => ({
          headerShown: false,
          gestureEnabled: true,
          cardOverlayEnabled: true,
          cardStyle: { backgroundColor: 'transparent' },
          presentation: 'modal',
          headerStatusBarHeight: navigation.getState().routes.indexOf(route) > 0 ? 0 : undefined,
          ...TransitionPresets.ModalPresentationIOS,
        })}
      >
        <ModalStack.Screen name="RootStack">
          {() => (
            <RootStack.Navigator
              initialRouteName="Tabs"
              detachInactiveScreens={shouldDetachInactiveScreens}
              screenOptions={{ presentation: 'modal', ...slideFromRightTransition }}
            >
              <RootStack.Screen name="Tabs" options={{ headerShown: false }}>
                {() => <TabNavigator theme={props.theme} />}
              </RootStack.Screen>
              <RootStack.Screen
                name="NewGoods"
                component={NewGoodsScreen}
                options={({ route, navigation }) => ({
                  title: '新增货品',
                  ...(Platform.OS === 'ios' && {
                    headerShown: false,
                    gestureEnabled: true,
                    cardOverlayEnabled: true,
                    headerStatusBarHeight:
                      navigation
                        .getState()
                        .routes.findIndex((r: RouteProp<any, any>) => r.key === route.key) > 0
                        ? 0
                        : undefined,
                    ...TransitionPresets.ModalPresentationIOS,
                  }),
                })}
              />
            </RootStack.Navigator>
          )}
        </ModalStack.Screen>
        <ModalStack.Screen name="BarCode" component={BarCodeScanner} />
      </ModalStack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginBottom: Platform.OS === 'ios' ? -3 : 0,
  },
});
