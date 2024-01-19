import { AntDesign } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Linking, Platform, TouchableOpacity, View } from 'react-native';
import { Button, Checkbox, Text } from 'react-native-paper';

import { useAuthLogin } from '../../../apis/use-api';
import { showToast } from '../../../core/utils';
import { useAuthStore } from '../../../hooks/auth-store';
import EmailInput from '../components/email-input';
import { Logo } from '../components/logo';
import PasswordInput from '../components/password-input';

export default function Login({ navigation }) {
  const { mutate, data: response, isLoading, error, isError, isSuccess } = useAuthLogin();
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckBoxToggle = () => {
    setIsChecked(!isChecked);
  };

  useEffect(
    function () {
      if (isError && error && !isLoading) {
        showToast(error.message, 'error');
      }
    },
    [isError, error, isLoading]
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const togglePasswordVisibility = () => setIsPasswordSecure(!isPasswordSecure);

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    mutate(formData);
  };
  const { login } = useAuthStore();

  useEffect(() => {
    if (isSuccess) {
      login({
        access: response?.data?.accessToken,
        refresh: response?.data?.accessToken,
        user: response?.data?.user,
      });
    }
  }, [isSuccess, response, login]);

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
          <View className="h-[40%] w-full items-center justify-center pb-16">
            <Logo />
          </View>
          <Text variant="titleMedium" className="mb-2 text-2xl text-slate-800">
            Login
          </Text>
          <View className="w-full">
            <EmailInput
              control={control}
              errors={errors}
              togglePasswordVisibility={togglePasswordVisibility}
            />

            <View className="mb-4 " />

            <PasswordInput
              control={control}
              errors={errors}
              isPasswordSecure={isPasswordSecure}
              setIsPasswordSecure={setIsPasswordSecure}
            />

            <View className="my-3 flex flex-row items-center justify-between">
              <Checkbox
                color="green"
                status={isChecked ? 'checked' : 'unchecked'}
                onPress={handleCheckBoxToggle}
              />
              <TouchableOpacity
                className="mb-2 "
                onPress={() =>
                  Linking.openURL('https://mycreditbook.com/privacy-policy.html').catch((err) =>
                    console.error('Error', err)
                  )
                }>
                <Text className="text-green-600 mt-1">I have accepted the privacy policy</Text>
              </TouchableOpacity>
            </View>

            <Button
              mode="contained"
              disabled={!isChecked}
              className={`mt-2 justify-center p-1 ${!isChecked && 'opacity-50'} bg-emerald-900`}
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}>
              <Text className="text-white">Login</Text>
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
