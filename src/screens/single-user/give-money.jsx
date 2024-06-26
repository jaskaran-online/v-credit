import {
  AntDesign,
  Entypo,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useQueryClient } from '@tanstack/react-query';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image, Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

import { useCreateUserTransaction } from '../../apis/use-api';
import ContactList from '../../components/contact-list-model';
import { COLORS } from '../../core';
import { showToast } from '../../core/utils';
import { useAuthStore } from '../../hooks/auth-store';
import { useContactsStore } from '../../hooks/zustand-store';
import navigations from '../../navigations';
import { BottomSheetBackground, renderBackdropComponent } from '../auth/register/register';

export default function GiveMoney() {
  const { user: auth } = useAuthStore();
  const {
    mutate: request,
    data: paymentApiResponse,
    isSuccess: isPaymentSuccess,
  } = useCreateUserTransaction();

  const contacts = useContactsStore((state) => state.contactsList) || [];
  const [selectedContact, setSelectedContact] = useState(null);
  const [setSelectedMobileNumber] = useState(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [photoSelector, setPhotoSelector] = useState(false);
  const [imageUri, setImageUri] = useState('');
  const [amount, setAmount] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Get QueryClient from the context
  const queryClient = useQueryClient();

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['88%', '95%'], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
    Keyboard.dismiss();
  }, []);

  const handleFormSubmit = () => {
    const formData = new FormData();
    formData.append('user_id', auth.user.id);
    formData.append('from_mobile', auth.user.mobile);
    formData.append(
      'from_date',
      selectedDate.getFullYear() +
        '-' +
        (selectedDate.getMonth() + 1) +
        '-' +
        selectedDate.getDate()
    );
    formData.append('amount', amount);
    formData.append('transaction_type_id', 1);
    formData.append('to_mobile', mobileNumber);
    if (imageUri) {
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg', // Modify the type based on your image type
        name: 'image.jpg', // Modify the name based on your image name
      });
    }
    formData.append('to_mobile', mobileNumber);
    formData.append('to_name', selectedContact?.name);
    formData.append('transaction_type_id', 1);

    if (auth?.user?.mobile) {
      formData.append('from_mobile', auth.user.mobile);
    }
    formData.append('to_mobile', mobileNumber);

    request(formData);
  };

  useEffect(() => {
    if (isPaymentSuccess) {
      showToast(paymentApiResponse.data.message, 'success');

      queryClient.invalidateQueries(['userCustomerList', auth.user.mobile]);
      queryClient.invalidateQueries(['userTodayTransactionsTotal', auth.user.mobile]);
      queryClient.invalidateQueries(['userTodayTransactions', auth.user.mobile]);

      setTimeout(() => navigations.navigate('HomePage'), 1000);
    }
  }, [isPaymentSuccess, auth, queryClient]);

  const handleCameraCapture = async () => {
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    if (cameraStatus === 'granted') {
      const photo = await ImagePicker.launchCameraAsync();
      if (!photo?.cancelled) {
        setImageUri(photo.assets[0].uri);
        bottomSheetModalRef.current?.dismiss();
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      bottomSheetModalRef.current?.dismiss();
    }
  };

  const handleDateChange = (event, date) => {
    setDatePickerVisibility(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <View className="mb-1" />
        {selectedContact && <Text className="text-slate-600 mb-1 mt-2">Name</Text>}
        <TouchableOpacity
          onPress={() => {
            handlePresentModalPress();
            setSelectedContact(null);
            setPhotoSelector(false);
          }}
          className="h-[50px] border border-slate-500 bg-white rounded-[4px] flex flex-row items-center px-4 justify-between">
          {selectedContact ? (
            <Text className="text-gray-900">{selectedContact?.name}</Text>
          ) : (
            <Text className="text-slate-600">Select User</Text>
          )}
          {selectedContact ? (
            <AntDesign name="close" size={16} color="gray" />
          ) : (
            <AntDesign name="down" size={18} color="gray" />
          )}
        </TouchableOpacity>
        <View className="mb-1" />
        {selectedContact && (
          <>
            <TextInput
              mode="outlined"
              label="Mobile Number"
              keyboardType="number-pad"
              className="h-[50px] bg-white"
              placeholder="Enter Mobile Number"
              value={mobileNumber}
              onChangeText={(text) => setMobileNumber(text)}
              right={
                <TextInput.Icon
                  icon={() => (
                    <MaterialCommunityIcons
                      onPress={
                        (selectedContact && selectedContact?.phoneNumbers)?.length > 1
                          ? handlePresentModalPress
                          : () => null
                      }
                      name="chevron-down"
                      size={20}
                      color="gray"
                    />
                  )}
                />
              }
            />
          </>
        )}

        <View className="mb-1" />

        <View className="flex flex-row items-center justify-between">
          <TextInput
            label="Amount"
            mode="outlined"
            keyboardType="number-pad"
            className="h-[50px] bg-white flex-1"
            placeholder="Enter Amount"
            value={amount.toString()}
            onChangeText={(text) => setAmount(text)}
          />
          <TouchableOpacity
            onPress={() => {
              setPhotoSelector(true);
              handlePresentModalPress();
            }}
            className="p-1 mx-3  bg-slate-50 rounded-md">
            <MaterialIcons name="add-photo-alternate" size={35} color="black" />
          </TouchableOpacity>
        </View>

        {/* Date Selector */}
        <TouchableOpacity style={styles.itemSelector} onPress={showDatePicker}>
          <Text style={styles.itemText}>{selectedDate.toDateString()}</Text>
          <Entypo name="calendar" size={20} color="gray" />
        </TouchableOpacity>

        {/* Date Picker Component */}
        {isDatePickerVisible && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="inline"
            onChange={handleDateChange}
          />
        )}

        <TextInput
          label="Notes"
          mode="outlined"
          multiline={true}
          numberOfLines={4}
          className="bg-white"
        />
        <View className="mb-1" />
        {imageUri && (
          <Image
            source={{ uri: imageUri, width: 150, height: 150 }}
            resizeMethod="auto"
            className="mt-4"
          />
        )}
        <View className="mb-1" />
        <Button
          mode="contained"
          className="mt-2 p-1 justify-center bg-emerald-900"
          onPress={handleSubmit(handleFormSubmit)}>
          <Text variant="titleMedium" className="text-white">
            Save
          </Text>
        </Button>
      </View>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={photoSelector ? ['30%', '25%'] : snapPoints}
        backdropComponent={renderBackdropComponent}
        backgroundComponent={(props) => <BottomSheetBackground {...props} />}
        handleIndicatorStyle={{
          backgroundColor: COLORS.lightGray,
        }}>
        {photoSelector ? (
          <>
            <View className="flex flex-row items-center justify-evenly pt-12">
              <View className="items-center gap-2">
                <TouchableOpacity onPress={handleCameraCapture} className="p-2 rounded-lg">
                  <MaterialIcons name="enhance-photo-translate" size={30} color="black" />
                </TouchableOpacity>
                <Text variant="bodyMedium" className="font-bold">
                  Camera
                </Text>
              </View>
              <View className="items-center gap-2">
                <TouchableOpacity onPress={pickImage} className="p-2 rounded-lg">
                  <MaterialIcons name="add-photo-alternate" size={30} color="black" />
                </TouchableOpacity>
                <Text variant="bodyMedium" className="font-bold">
                  Gallery
                </Text>
              </View>
            </View>
          </>
        ) : (
          <>
            {selectedContact?.phoneNumbers?.length > 1 ? (
              <View className="flex-1 mt-2">
                <Text className="mb-2 text-xl font-bold text-gray-800 ml-4">Select Number</Text>
                <BottomSheetFlatList
                  onscroll={() => Keyboard.dismiss()}
                  estimatedItemSize={1000}
                  renderItem={({ item, index: i }) => (
                    <TouchableOpacity
                      key={i}
                      style={{
                        width: '100%',
                        height: 80,
                      }}
                      onPress={() => {
                        setSelectedMobileNumber(item);

                        if (item.number.includes('-')) {
                          setMobileNumber(item.number.replaceAll('-', ''));
                        } else {
                          setMobileNumber(item.number);
                        }

                        bottomSheetModalRef.current?.dismiss();
                      }}
                      className="p-4 bg-slate-50 mt-2 mx-4 rounded-md flex flex-row items-center w-full h-16">
                      <FontAwesome6 name="mobile-retro" size={24} color="gray" />
                      <View className="ml-4 flex flex-row">
                        <Text variant="titleSmall" className="text-slate-900">
                          {item.number}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  data={selectedContact?.phoneNumbers}
                />
              </View>
            ) : (
              <ContactList
                contacts={contacts}
                onSelect={(selectedContactItem) => {
                  bottomSheetModalRef.current?.dismiss();
                  setSelectedContact(selectedContactItem);

                  if ((selectedContactItem?.phoneNumbers[0].number).includes('-')) {
                    setMobileNumber(
                      (selectedContactItem?.phoneNumbers[0].number).replaceAll('-', '')
                    );
                  } else {
                    setMobileNumber(selectedContactItem?.phoneNumbers[0].number);
                  }
                }}
                onscroll={() => Keyboard.dismiss()}
              />
            )}
          </>
        )}
      </BottomSheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  itemSelector: {
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    marginTop: 7,
    paddingHorizontal: 16,
  },
  itemText: {
    fontSize: 16,
  },
});
