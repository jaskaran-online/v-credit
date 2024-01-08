import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, View, TouchableOpacity, Linking } from 'react-native';
import { Button, Text, Checkbox } from 'react-native-paper';

import EmailInput from './components/email-input';
import { Logo } from './components/logo';
import PasswordInput from './components/password-input';
import { useAuthLogin } from '../../../apis/use-api';
import { showToast } from '../../../core/utils';
import { useAuthStore } from '../../../hooks/auth-store';

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

            <View className="my-3 flex flex-row items-center justify-between">
              <Checkbox
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
                <Text className="text-blue-600 mt-1">I have accepted the privacy policy</Text>
              </TouchableOpacity>
            </View>

            <Button
              mode="contained"
              disabled={!isChecked}
              className={`mt-2 h-12 justify-center rounded-md ${
                !isChecked && 'opacity-50'
              } bg-emerald-900`}
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
