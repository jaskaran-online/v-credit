import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Image, KeyboardAvoidingView, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { COLORS } from "../../core";
import {useAuth} from "../../hooks";
import { useForm, Controller } from 'react-hook-form';
import {useAuthLogin, useTransactionsData} from "../../apis/useApi";
import Toast from "react-native-toast-message";
const showToast = (error) => {
    Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.message || "Something went wrong!",
    });
}

export default function Index() {
    const {mutate,  data : response, isLoading, error, isError, isSuccess} = useAuthLogin();

    if(isError){
        showToast(error);
    }
    const { control, handleSubmit, formState : {errors} } = useForm();
    const keyboardVerticalOffset = Platform.OS === "ios" ? 40 : 0;
    const [isPasswordSecure, setIsPasswordSecure] = useState(true);
    const signIn = useAuth.use.signIn();
    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append('email', data.email);
        formData.append('password', data.password);
        mutate(formData);
        if(isSuccess){
            signIn({ access: response?.data?.accessToken, refresh: response?.data?.accessToken, user : response?.data?.user }, )
        }
    };


  return (
    <View className={"flex-1"}>
      <StatusBar />

      <View
        className={
          "w-[50] h-[50] bg-slate-50 absolute top-[85%] right-[15%] z-10 rounded-full"
        }
      />
      <View
        className={
          "w-[30] h-[30] bg-neutral-100 absolute top-[20%] left-[15%] z-10 rounded-full"
        }
      />
      <View
        className={
          "w-[150] h-[150] bg-green-50 absolute top-[-20] right-[-30] z-30 rounded-full"
        }
      />
      <View
        className={
          "w-[150] h-[150] bg-blue-50 absolute bottom-[-40] left-[-30] z-30 rounded-full"
        }
      />

      <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 items-center justify-evenly bg-white w-full z-50"
      >
        <View className={"h-1/2 w-full px-6 flex"}>
          <Image
            source={require("../../../assets/logo.png")}
            className={"w-[150] h-[150] m-auto"}
          />
          <Text
            variant={"titleLarge"}
            className={"mb-2 text-3xl text-slate-900"}
          >
            Login
          </Text>
          <View className={"w-full flex-1"}>
            <>
                <Controller
                    control={control}
                    rules={{
                        required: 'Email is required',
                        pattern: {
                            value: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                            message: 'Invalid email address',
                        },
                        minLength: {
                            value: 6,
                            message: 'Minimum length is 6 characters',
                        }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            onBlur={onBlur}
                            onChangeText={(text) => onChange(text)}
                            value={value}
                            label="Email"
                            className={"bg-white"}
                            mode={"outlined"}
                            placeholder={"Enter Email"}
                            placeholderTextColor={COLORS.darkGray}
                            activeOutlineColor={"darkgreen"}
                            left={
                                <TextInput.Icon
                                    onPress={() => {
                                        isPasswordSecure
                                            ? setIsPasswordSecure(false)
                                            : setIsPasswordSecure(true);
                                    }}
                                    icon={() => (
                                        <MaterialCommunityIcons name={"email"} size={20} />
                                    )}
                                />
                            }
                        />
                    )}
                    name="email"
                    defaultValue=""
                />
                {errors?.email && <Text variant={"bodySmall"} className={"text-amber-700 font-bold mt-1"}>*{errors?.email?.message}</Text>}
                <View className={"mb-4 "} />
                <Controller
                    control={control}
                    rules={{
                        required: 'Password is required',
                        minLength: {
                            value: 6,
                            message: 'Minimum length is 6 characters',
                        },
                        maxLength: {
                            value: 12,
                            message: 'Maximum length is 12 characters',
                        },
                        pattern: {
                            value: /^[A-Za-z]+$/i,
                            message: 'Invalid characters',
                        },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (

                        <TextInput
                            onBlur={onBlur}
                            onChangeText={(text) => onChange(text)}
                            value={value}
                            label="Password"
                            placeholder={"Enter Password"}
                            mode={"outlined"}
                            className={"bg-white"}
                            secureTextEntry={isPasswordSecure}
                            placeholderTextColor={COLORS.darkGray}
                            activeOutlineColor={"darkgreen"}
                            right={
                                <TextInput.Icon
                                    onPress={() => {
                                        isPasswordSecure
                                            ? setIsPasswordSecure(false)
                                            : setIsPasswordSecure(true);
                                    }}
                                    icon={() => (
                                        <MaterialCommunityIcons
                                            name={isPasswordSecure ? "eye-off" : "eye"}
                                            size={24}
                                        />
                                    )}
                                />
                            }
                            left={
                                <TextInput.Icon
                                    onPress={() => {
                                        isPasswordSecure
                                            ? setIsPasswordSecure(false)
                                            : setIsPasswordSecure(true);
                                    }}
                                    icon={() => (
                                        <MaterialCommunityIcons name={"key"} size={20} />
                                    )}
                                />
                            }
                        />
                    )}
                    name="password"
                    defaultValue=""
                />
                {errors?.password && <Text variant={"bodySmall"} className={"text-amber-700 font-bold mt-1"}>*{errors?.password?.message}</Text>}

            </>
            <Button
              mode={"contained"}
              className={"bg-emerald-900 rounded-md mt-4 h-12 justify-center"}
              onPress={handleSubmit(onSubmit)}
            >
              Login
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
