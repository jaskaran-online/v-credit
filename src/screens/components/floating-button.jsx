import { BlurView } from 'expo-blur';
import { memo } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

import { useAuthCompanyStore } from '../../hooks/zustand-store';

const FloatingButtons = ({ navigation, customer }) => {
  const company = useAuthCompanyStore((state) => state.selectedCompany);

  return (
    <BlurView
      intensity={5}
      tint="light"
      className="flex h-24 w-full flex-row justify-evenly space-x-2 px-4 pt-5">
      <View className="flex-1">
        <Button
          mode="contained"
          onPress={() =>
            navigation.navigate(company ? 'TakeMoney' : 'SingleUserReceiveMoney', { customer })
          }
          className="bg-sky-500">
          Take Payment
        </Button>
      </View>
      <View className="flex-1">
        <Button
          mode="contained"
          onPress={() =>
            navigation.navigate(company ? 'GiveMoney' : 'SingleUserGiveMoney', { customer })
          }
          className="bg-amber-500">
          Give Credit
        </Button>
      </View>
    </BlurView>
  );
};

export default memo(FloatingButtons);
