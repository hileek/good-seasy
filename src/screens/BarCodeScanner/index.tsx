import { StackScreenProps } from '@react-navigation/stack';
import * as BarCodeScanner from 'expo-barcode-scanner';
import { BlurView } from 'expo-blur';
import { FlashMode } from 'expo-camera';
import { throttle } from 'lodash';
import { useEffect, useReducer, useState, useCallback } from 'react';
import { Linking, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, BarCodeScanningResult } from 'expo-camera';
import QRFooterButton from '../../components/QRFooterButton';
import QRIndicator from '../../components/QRIndicator';
import { ModalStackRoutes } from '../../navigation/Navigation.types';

type State = {
  isVisible: boolean;
  data: string;
};

const initialState: State = { isVisible: Platform.OS === 'ios', data: '' };

export default function BarCodeScreen(props: StackScreenProps<ModalStackRoutes, 'BarCode'>) {
  // const [state, setState] = useReducer(
  //   (props: State, state: Partial<State>): State => ({ ...props, ...state }),
  //   initialState
  // );
  const [state, setState] = useReducer(
    (props: State, state: Partial<State>): State => ({ ...props, ...state }),
    initialState
  );
  const [isLit, setLit] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (!state.isVisible) {
      timeout = setTimeout(() => {
        setState({ isVisible: true });
      }, 1000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const handleBarCodeScanned = throttle((scanData: BarCodeScanningResult) => {
    console.log(state,'===11=')
    setState({ isVisible: false, data: '1' });
    props.navigation.pop();
    props.route.params?.onBarCodeScanned(scanData);

    setTimeout(
      () => {
        // 注意：在打开之前手动重置状态栏，以便在返回主页时恢复正确的状态栏颜色。
        StatusBar.setBarStyle('default');
        // Linking.openURL(url);
      },
      Platform.select({
        ios: 16,
        // 注意：在Android上给模态框一点时间来消失
        default: 500,
      })
    );
  }, 1000);

  const onCancel = useCallback(() => {
    if (Platform.OS === 'ios') {
      props.navigation.pop();
    } else {
      props.navigation.goBack();
    }
  }, []);

  const onFlashToggle = useCallback(() => {
    setLit((isLit) => !isLit);
  }, []);

  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {state.isVisible ? (
        <Camera
          barCodeScannerSettings={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
          }}
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFill}
          flashMode={isLit ? FlashMode.torch : FlashMode.off}
        />
      ) : null}

      <View style={[styles.header, { top: 40 + top }]}>
        <Hint>请扫描二维码</Hint>
      </View>

      {/* <QRIndicator /> */}

      <View style={[styles.footer, { bottom: 30 + bottom }]}>
        <QRFooterButton onPress={onFlashToggle} isActive={isLit} iconName="flashlight" />
        <QRFooterButton onPress={onCancel} iconName="close" iconSize={48} />
      </View>

      <StatusBar barStyle="light-content" backgroundColor="#000" />
    </View>
  );
}

function Hint({ children }: { children: string }) {
  return (
    <BlurView style={styles.hint} intensity={100} tint="dark">
      <Text style={styles.headerText}>{children}</Text>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hint: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '10%',
  },
});
