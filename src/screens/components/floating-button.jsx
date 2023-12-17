import { BlurView } from 'expo-blur';
import { memo } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

const FloatingButtons = ({ navigation, customer }) => {
  return (
    <BlurView
      intensity={5}
      tint="light"
      className="flex h-24 w-full flex-row justify-evenly space-x-2 px-4 pt-5">
      <View className="flex-1">
        <Button
          mode="contained"
          onPress={() => navigation.navigate('TakeMoney', { customer })}
          className="bg-sky-500">
          Take Payment
        </Button>
      </View>
      <View className="flex-1">
        <Button
          mode="contained"
          onPress={() => navigation.navigate('GiveMoney', { customer })}
          className="bg-amber-500">
          Give Credit
        </Button>
      </View>
    </BlurView>
  );
};

export default memo(FloatingButtons);
