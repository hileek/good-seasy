import { StackScreenProps } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { HomeStackRoutes } from '../../navigation/Navigation.types';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ModalStackRoutes } from '../../navigation/Navigation.types';
import { BarCodeScanningResult } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { alertWithCameraPermissionInstructions, requestCameraPermissionsAsync } from '@/utils/PermissionUtils';
import ThemedStatusBar from '../../components/ThemedStatusBar';

export default function HomeScreen(props: StackScreenProps<HomeStackRoutes, 'Home'>) {
  const [isFocused, setFocused] = useState(true);
  const navigation = useNavigation<NavigationProp<ModalStackRoutes>>();

  const onBarCodeScanned = (data: BarCodeScanningResult) => {
    console.log(data);
  };

  // 打开扫码界面
  const handleBarPressAsync = async () => {
    props.navigation.navigate('NewGoods');
return
    if (await requestCameraPermissionsAsync()) {
      navigation.navigate('BarCode', { onBarCodeScanned });
    } else {
      await alertWithCameraPermissionInstructions();
    }
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      setFocused(true);
    });
    const unsubscribeBlur = props.navigation.addListener('blur', () => {
      setFocused(false);
    });
    console.log(1);

    return () => {
      unsubscribe();
      unsubscribeBlur();
    };
  }, [props.navigation]);

  return (
    <View style={{ flex: 1 }}>
      <ThemedStatusBar />
      <Text onPress={handleBarPressAsync}>设置</Text>
    </View>
  );
}
