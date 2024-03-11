import * as Camera from 'expo-camera';
import { Alert, Linking } from 'react-native';

export async function requestCameraPermissionsAsync(): Promise<boolean> {
  const { status } = await Camera.requestCameraPermissionsAsync();
  return status === 'granted';
}

export async function alertWithCameraPermissionInstructions(): Promise<void> {
  return Alert.alert(
    '需要权限',
    '要使用扫描仪，您必须获得访问摄像头的许可。您可以在“设置”应用程序中授予此权限。',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: '去设置',
        onPress: () => Linking.openSettings(),
      },
    ],
    {
      cancelable: true,
    }
  );
}
