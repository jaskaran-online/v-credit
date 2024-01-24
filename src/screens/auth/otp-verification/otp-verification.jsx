import { AntDesign } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import { Button, Text } from 'react-native-paper';

import { useOTPVerify } from '../../../apis/use-api';
import { Logo } from '../components/logo';

export default function OtpVerification({ navigation, route }) {
  let otpInputRef = useRef(null);
  const { id } = route.params || 1;

  const { mutate: otpVerify, isSuccess, isLoading } = useOTPVerify();
  const [code, setCode] = useState('');

  console.log(code);
  console.log(code.length);

  const clearText = () => {
    setCode('');
    otpInputRef?.current?.clearText();
  };

  if (isSuccess) {
    navigation.navigate('Login');
  }

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
              handleTextChange={(text) => setCode(text)}
            />
            <View className="mb-6" />
            <View className="w-full flex flex-row justify-between">
              <Button
                disabled={code.length !== 4}
                loading={isLoading}
                mode="contained"
                className={`mt-2 w-[46%] justify-center bg-emerald-900 ${code.length !== 4 ? 'opacity-50' : ''}`}
                onPress={() => {
                  otpVerify({
                    code,
                    id,
                  });
                }}>
                <Text className="text-white font-bold" variant="titleMedium">
                  {isLoading ? 'Verifying...' : 'Verify'}
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
