import { AntDesign } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, TouchableOpacity, View, ToastAndroid } from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import { Button, Text } from 'react-native-paper';

import { useAuthLogin, useOTPVerify } from '../../../apis/use-api';
import { useAuthStore } from '../../../hooks/auth-store';
import { Logo } from '../components/logo';

export default function OtpVerification({ navigation, route }) {
  const {
    mutate,
    data: response,
    isLoading: isLoginLoading,
    error: loginError,
    isError: loginIsError,
    isSuccess: loginIsSuccess,
  } = useAuthLogin();

  const { login } = useAuthStore();

  useEffect(() => {
    if (loginIsSuccess) {
      login({
        access: response?.data?.accessToken,
        refresh: response?.data?.accessToken,
        user: response?.data?.user,
      });
    }
  }, [loginIsSuccess, response, login]);

  let otpInputRef = useRef(null);
  const { id, email, password } = route.params;

  console.log({ id, email, password });

  const { mutate: otpVerify, isSuccess, isLoading, data, error, isError } = useOTPVerify();
  const [code, setCode] = useState('');

  console.log(code);
  console.log(code.length);

  const clearText = () => {
    setCode('');
    otpInputRef?.current?.clearText();
  };

  useEffect(
    function () {
      if (isError) {
        ToastAndroid.show('OTP is not valid, please try again!', ToastAndroid.SHORT);
      }
    },
    [isError]
  );

  useEffect(
    function () {
      if (isSuccess) {
        ToastAndroid.show('Email verified!', ToastAndroid.SHORT);
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        mutate(formData);
      }
    },
    [email, isSuccess, mutate, password]
  );

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
                    otp: code,
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
