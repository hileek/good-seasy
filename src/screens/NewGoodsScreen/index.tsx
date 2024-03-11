import { StackScreenProps } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { HomeStackRoutes } from '../../navigation/Navigation.types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NewGoodsScreen() {

  return (
    <View style={{ flex: 1 }}>
      <Text>新增</Text>
    </View>
  );
}
