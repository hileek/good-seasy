import { StackScreenProps } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { SettingsStackRoutes } from '../../navigation/Navigation.types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }: StackScreenProps<SettingsStackRoutes, 'Settings'>) {
  const [isFocused, setFocused] = useState(true);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setFocused(true);
    });
    const unsubscribeBlur = navigation.addListener('blur', () => {
      setFocused(false);
    });

    return () => {
      unsubscribe();
      unsubscribeBlur();
    };
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <Text>设置</Text>
    </View>
  );
}
