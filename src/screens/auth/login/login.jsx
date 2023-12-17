import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import EmailInput from './components/email-input';
import { Logo } from './components/logo';
import PasswordInput from './components/password-input';
import { useAuthLogin } from '../../../apis/use-api';
import { showToast } from '../../../core/utils';
import { useAuth } from '../../../hooks';

export default function Login() {
  const { mutate, data: response, isLoading, error, isError, isSuccess } = useAuthLogin();

  useEffect(
    function () {
      if (isError && error && !isLoading) {
        showToast(error.message, 'error');
      }
    },
    [isError, error, isLoading],
  );
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const signIn = useAuth.use.signIn();
  const togglePasswordVisibility = () => setIsPasswordSecure(!isPasswordSecure);

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    mutate(formData);
  };

  if (isSuccess) {
    signIn({
      access: response?.data?.accessToken,
      refresh: response?.data?.accessToken,
      user: response?.data?.user,
    });
  }

  return (
    <View className="flex-1">
      <StatusBar />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="z-50 w-full flex-1 items-center justify-evenly bg-white">
        <View className="flex h-1/2 w-full px-6">
          <Logo />
          <Text variant="titleLarge" className="mb-2 text-3xl text-slate-900">
            Login
          </Text>
          <View className="w-full flex-1">
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
            <Button
              mode="contained"
              className="mt-4 h-12 justify-center rounded-md bg-emerald-900"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}>
              Login
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
