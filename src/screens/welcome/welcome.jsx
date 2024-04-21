import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { Logo } from '../auth/components/logo';

export default function Welcome({ navigation }) {
  return (
    <View className="flex-1 items-center justify-between bg-white">
      <View className="h-[45%] w-full items-center justify-center pt-16">
        <Logo />
      </View>
      <View className="flex h-[55%] w-full bg-green-50 rounded-t-[40px] px-6">
        <Text variant="titleLarge" className="mt-12 px-4 font-bold text-green-900">
          Welcome to
        </Text>
        <Text variant="displaySmall" className="font-bold px-4 text-green-900">
          My Credit App
        </Text>
        <View className="px-4 mt-8">
          <Text variant="bodyMedium" className="text-left text-slate-900">
            Manage finances easily with My Credit App: monitor transactions, analyze spending
            habits, improve decision making. Get started today!
          </Text>
        </View>
        <View className="flex gap-4 mt-8 px-4 w-full">
          <Button
            mode="contained"
            className="bg-green-800 w-full p-1"
            onPress={() => navigation.navigate('Login')}>
            <Text className="text-white font-bold">Login</Text>
          </Button>
          <Button
            mode="contained-tonal"
            className="bg-slate-900/90 w-full p-1"
            onPress={() => navigation.navigate('Register')}>
            <Text className="text-white font-bold">Register</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
