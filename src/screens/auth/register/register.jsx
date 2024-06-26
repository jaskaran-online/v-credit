import { AntDesign, Ionicons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  View,
} from 'react-native';
import { Button, Checkbox, Text, TextInput as TextInputNew } from 'react-native-paper';

import { useRegisterUser } from '../../../apis/use-api';
import { COLORS } from '../../../core';
import { showToast } from '../../../core/utils';
import EmailInput from '../components/email-input';
import { Logo } from '../components/logo';
import PasswordInput from '../components/password-input';
import UsernameInput from '../components/username-input';

const initialSelectedCountry = {
  flags: {
    png: 'https://flagcdn.com/w320/in.png',
    svg: 'https://flagcdn.com/in.svg',
    alt: 'The flag of India is composed of three equal horizontal bands of saffron, white and green. A navy blue wheel with twenty-four spokes — the Ashoka Chakra — is centered in the white band.',
  },
  name: {
    common: 'India',
    official: 'Republic of India',
    nativeName: {
      eng: {
        official: 'Republic of India',
        common: 'India',
      },
      hin: {
        official: 'भारत गणराज्य',
        common: 'भारत',
      },
      tam: {
        official: 'இந்தியக் குடியரசு',
        common: 'இந்தியா',
      },
    },
  },
  idd: {
    root: '+9',
    suffixes: ['1'],
  },
};

export const renderBackdropComponent = (props) => (
  <BottomSheetBackdrop
    {...props}
    disappearsOnIndex={-1}
    appearsOnIndex={0}
    opacity={0.4}
    enableTouchThrough
    pressBehavior="close"
  />
);

const fetchCountries = async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,idd');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    throw new Error('Network response was not ok');
  }
};

export const BottomSheetBackground = ({ style }) => {
  return (
    <View
      style={[
        {
          backgroundColor: COLORS.white,
          borderRadius: 28,
        },
        { ...style },
      ]}
    />
  );
};

export default function Register({ navigation }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isChecked, setIsChecked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countries || []);
  const [selectedCountry, setSelectedCountry] = useState(initialSelectedCountry);
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);

  const {
    data: countries,
    error: countryError,
    isLoading: isCountryLoading,
    isError: isCountryError,
  } = useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  const {
    mutate: registerUser,
    isLoading: registerLoading,
    isSuccess,
    data: response,
  } = useRegisterUser();

  // ref for bottom sheet modal
  const bottomSheetModalRef = useRef(null);

  // variables for bottom sheet modal
  const snapPoints = useMemo(() => ['70%', '80%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCheckBoxToggle = () => {
    setIsChecked(!isChecked);
  };

  useEffect(
    function () {
      if (isCountryError && countryError && !isCountryLoading) {
        showToast(countryError.message, 'error');
      }
    },
    [isCountryError, countryError, isCountryLoading]
  );
  const togglePasswordVisibility = () => setIsPasswordSecure(!isPasswordSecure);
  const [password, setPassword] = useState('');

  function handleSelectCountry(item) {
    setSelectedCountry(item);
    setSearchQuery('');
    bottomSheetModalRef.current?.close();
  }

  function handleFormSubmit(data) {
    if (!isChecked) {
      showToast('Please accept terms and conditions', 'error');
    } else {
      setPassword(data.password);
      registerUser({
        country_code: `${selectedCountry?.idd?.root}${selectedCountry?.idd?.suffixes[0]}`,
        name: data.username,
        mobile: data.mobileNumber,
        email: data.email,
        password: data.password,
      });
    }
  }

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter((country) =>
        country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [searchQuery, countries]);

  if (isSuccess && response?.user) {
    ToastAndroid.show('Please verify your email!', ToastAndroid.SHORT);
    navigation.navigate('OtpVerification', {
      email: response?.user?.email,
      password,
      id: response?.user?.id,
    });
  }

  return (
    <View className="flex-1">
      <StatusBar />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="z-50 w-full flex-1 items-center bg-white justify-start">
        <TouchableOpacity
          className="absolute top-20 left-8 bg-slate-100 p-2 px-4 rounded-full flex flex-row items-center justify-between gap-x-2"
          onPress={() => {
            navigation.navigate('Welcome');
          }}>
          <AntDesign name="back" size={16} color="gray" />
          <Text className="text-gray-500">Back</Text>
        </TouchableOpacity>
        <View className="flex h-1/4 w-full px-6 mt-44">
          <View className="h-[10%] w-full items-center justify-center pb-16">
            <Logo height={100} width={100} />
          </View>
          <View className="w-full mt-4">
            <Text variant="titleMedium" className="mb-2 text-2xl text-slate-800">
              Register
            </Text>

            <View className="mb-2 " />

            <UsernameInput control={control} errors={errors} />

            <View className="mb-3 " />

            <View className="h-[50px] border border-slate-500 bg-white rounded-[4px] flex flex-row items-center px-4">
              <TouchableOpacity
                onPress={handlePresentModalPress}
                className="flex flex-row items-center">
                <Image
                  source={{ uri: selectedCountry?.flags?.png }}
                  style={{ width: 20, height: 15, marginRight: 10 }}
                />
                <Text className="text-slate-900 mr-2">{`${selectedCountry?.idd?.root}${selectedCountry?.idd?.suffixes[0]}`}</Text>
              </TouchableOpacity>

              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="text-slate-900"
                    placeholder="Enter your mobile number"
                    placeholderTextColor="gray"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="number-pad"
                  />
                )}
                name="mobileNumber"
                rules={{ required: true, pattern: /^[0-9]+$/ }}
              />
            </View>
            {errors.mobileNumber && (
              <Text variant="bodySmall" className="mt-1 font-bold text-amber-700">
                *{errors?.mobileNumber?.message || 'Mobile is required'}
              </Text>
            )}

            <View className="mb-2 " />

            <EmailInput
              control={control}
              errors={errors}
              togglePasswordVisibility={togglePasswordVisibility}
            />

            <View className="mb-2 " />

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
              className={`mt-2 p-1 justify-center ${!isChecked && 'opacity-50'} bg-emerald-900`}
              onPress={handleSubmit(handleFormSubmit)}
              loading={registerLoading}>
              <Text className="text-white">{registerLoading ? 'Registering...' : 'Register'}</Text>
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdropComponent}
        backgroundComponent={(props) => <BottomSheetBackground {...props} />}
        handleIndicatorStyle={{
          backgroundColor: 'lightgray',
        }}>
        {countries && (
          <BottomSheetFlatList
            stickyHeaderIndices={[0]}
            ListHeaderComponent={
              <View style={{ paddingHorizontal: 20 }}>
                <TextInputNew
                  className="h-12 bg-white rounded-full border-slate-600"
                  mode="outlined"
                  placeholder="Search country"
                  value={searchQuery}
                  onChangeText={(text) => setSearchQuery(text)}
                  left={
                    <TextInputNew.Icon
                      icon={() => <Ionicons name="search-sharp" size={20} color="black" />}
                    />
                  }
                />
              </View>
            }
            estimatedItemSize={200}
            data={filteredCountries}
            keyExtractor={(item) => item.name.common}
            contentContainerStyle={{
              backgroundColor: COLORS.white,
              paddingVertical: 5,
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectCountry(item)}
                className="flex flex-row items-center mt-3 px-4 gap-x-2 bg-slate-100 rounded-lg py-4 mx-3">
                <Image
                  source={{ uri: item.flags.png }}
                  style={{ width: 30, height: 20, marginRight: 10 }}
                />
                <Text>{item.name.common}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </BottomSheetModal>
    </View>
  );
}
