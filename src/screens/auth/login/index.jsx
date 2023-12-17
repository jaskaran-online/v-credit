import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Image, KeyboardAvoidingView, Platform, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

import { useAuthLogin } from '../../../apis/use-api';
import { COLORS } from '../../../core';
import { showToast } from '../../../core/utils';
import { useAuth } from '../../../hooks';

export default function Index() {
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
          <Image
            source={require('../../../../assets/logo.png')}
            className="m-auto h-[150] w-[150]"
          />
          <Text variant="titleLarge" className="mb-2 text-3xl text-slate-900">
            Login
          </Text>
          <View className="w-full flex-1">
            <>
              <Controller
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                    message: 'Invalid email address',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={(text) => onChange(text)}
                    value={value}
                    label="Email"
                    className="bg-white"
                    mode="outlined"
                    placeholder="Enter Email"
                    placeholderTextColor={COLORS.darkGray}
                    activeOutlineColor="darkgreen"
                    left={
                      <TextInput.Icon
                        onPress={() => {
                          isPasswordSecure ? setIsPasswordSecure(false) : setIsPasswordSecure(true);
                        }}
                        icon={() => <MaterialCommunityIcons name="email" size={20} />}
                      />
                    }
                  />
                )}
                name="email"
                defaultValue=""
              />
              {errors?.email && (
                <Text variant="bodySmall" className="mt-1 font-bold text-amber-700">
                  *{errors?.email?.message}
                </Text>
              )}
              <View className="mb-4 " />
              <Controller
                control={control}
                rules={{
                  required: 'Password is required',
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={(text) => onChange(text)}
                    value={value}
                    label="Password"
                    placeholder="Enter Password"
                    mode="outlined"
                    className="bg-white"
                    secureTextEntry={isPasswordSecure}
                    placeholderTextColor={COLORS.darkGray}
                    activeOutlineColor="darkgreen"
                    right={
                      <TextInput.Icon
                        onPress={() => {
                          isPasswordSecure ? setIsPasswordSecure(false) : setIsPasswordSecure(true);
                        }}
                        icon={() => (
                          <MaterialCommunityIcons
                            name={isPasswordSecure ? 'eye-off' : 'eye'}
                            size={24}
                          />
                        )}
                      />
                    }
                    left={
                      <TextInput.Icon
                        onPress={() => {
                          isPasswordSecure ? setIsPasswordSecure(false) : setIsPasswordSecure(true);
                        }}
                        icon={() => <MaterialCommunityIcons name="key" size={20} />}
                      />
                    }
                  />
                )}
                name="password"
                defaultValue=""
              />
              {errors?.password && (
                <Text variant="bodySmall" className="mt-1 font-bold text-amber-700">
                  *{errors?.password?.message}
                </Text>
              )}
            </>
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
