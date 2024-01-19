import { AntDesign } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRef } from 'react';
import { KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import { Button, Text } from 'react-native-paper';

import { Logo } from '../components/logo';

export default function OtpVerification({ navigation }) {
  let otpInputRef = useRef(null);

  const clearText = () => {
    otpInputRef?.current?.clear();
  };

  return (
    <View className="flex-1">
      <StatusBar />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="z-50 w-full flex-1 items-center bg-white justify-center">
        <TouchableOpacity
          className="absolute top-24 left-8 bg-slate-100 p-2 px-4 rounded-full flex flex-row items-center justify-between gap-x-2"
          onPress={() => {
            navigation.navigate('Welcome');
          }}>
          <AntDesign name="back" size={16} color="gray" />
          <Text className="text-gray-500">Back</Text>
        </TouchableOpacity>
        <View className="flex h-1/2 w-full px-6">
          <View className="h-[50%] w-full items-center justify-center pb-16 mt-10">
            <Logo width={100} height={100} />
          </View>
          <Text variant="titleMedium" className="mb-2 text-2xl text-slate-600">
            OTP Verification
          </Text>
          <View className="w-full mt-8">
            <OTPTextInput
              ref={(e) => (otpInputRef = e)}
              autoFocus={true}
              textInputStyle={{
                fontSize: 20,
                backgroundColor: 'rgba(211,211,211,0.54)',
                borderRadius: 10,
                borderBottomColor: 'transparent',
              }}
            />
            <View className="mb-6" />
            <View className="w-full flex flex-row justify-between">
              <Button
                mode="contained"
                className="mt-2 w-[46%] justify-center bg-emerald-900"
                onPress={() => null}>
                <Text className="text-white font-bold" variant="titleMedium">
                  Verify
                </Text>
              </Button>
              <Button
                mode="contained"
                className="mt-2 p-1 w-[46%] justify-center bg-slate-900"
                onPress={clearText}>
                <Text className="text-white font-bold" variant="titleMedium">
                  Clear
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
