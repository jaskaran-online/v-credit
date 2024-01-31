import {
  AntDesign,
  Entypo,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image, Keyboard, Platform, TouchableOpacity, View } from 'react-native';
import { Button, Searchbar, Text, TextInput } from 'react-native-paper';

import Avatar from '../../components/avatar';
import { useContactsStore } from '../../hooks/zustand-store';
import { BottomSheetBackground, renderBackdropComponent } from '../auth/register/register';

function ContactList({ contacts, onSelect, onscroll }) {
  const [query, setQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState(contacts);

  function searchItem(text) {
    const newData = contacts?.filter((item) => {
      const itemData = `${item?.name?.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setFilteredContacts(newData);
    setQuery(text);
  }

  return (
    <View className="flex-1 px-4 mt-2">
      <Text className="mb-4 text-xl font-bold text-gray-800 ml-2">Select Customer</Text>
      <Searchbar
        onChangeText={(text) => searchItem(text)}
        value={query.toString()}
        style={{
          width: '100%',
          backgroundColor: 'transparent',
          marginBottom: 10,
        }}
        inputStyle={{
          fontSize: 14,
          lineHeight: Platform.OS === 'android' ? 16 : 0,
          paddingBottom: 10,
        }}
        placeholder="Search Customer Name"
        className="h-12 border-2 border-slate-200 bg-white"
      />
      <FlashList
        onScroll={onscroll}
        estimatedItemSize={1000}
        data={filteredContacts || []}
        renderItem={({ item, index: i }) => {
          const name = item.name;
          const searchTerm = query?.toUpperCase();
          const index = name?.toUpperCase().indexOf(searchTerm);
          if (index === -1) {
            return null;
          }
          const start = name?.slice(0, index);
          const highlight = name?.slice(index, index + searchTerm.length);
          const end = name?.slice(index + searchTerm.length);

          return (
            <TouchableOpacity
              key={i}
              onPress={() => onSelect(item)}
              className="p-4 bg-slate-50 mt-2 mx-2 rounded-md flex flex-row items-center w-full">
              <Avatar name={item.name} size={40} />
              <View className="ml-4">
                <Text>
                  {start}
                  <Text
                    style={{
                      color: 'dodgerblue',
                    }}>
                    {highlight}
                  </Text>
                  {end}
                </Text>
                <Text variant="titleSmall" className="text-slate-900">
                  {item.phoneNumbers.length > 0 && item.phoneNumbers[0].digits}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

export default function GiveMoney() {
  const contacts = useContactsStore((state) => state.contactsList) || [];
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedMobileNumber, setSelectedMobileNumber] = useState(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [photoSelector, setPhotoSelector] = useState(false);
  const [imageUri, setImageUri] = useState('');

  const {
    handleSubmit,
    formState: { errors },
  } = useForm();
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['88%', '95%'], []);
  const handlePresentModalPress = useCallback(() => bottomSheetModalRef.current?.present(), []);

  const handleFormSubmit = () => {
    console.log('form submitted');
  };

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
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <View className="mb-2" />
        {selectedContact && <Text className="text-slate-600 mb-1 mt-2">Name</Text>}
        <View className="flex flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => {
              handlePresentModalPress();
              setSelectedContact(null);
              setPhotoSelector(false);
            }}
            className="flex-1 h-[50px] border border-slate-500 bg-white rounded-[4px] flex flex-row items-center px-4 justify-between">
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

          <TouchableOpacity
            onPress={() => {
              setPhotoSelector(true);
              handlePresentModalPress();
            }}
            className="p-2 ml-5 mt-1 bg-blue-700 rounded-full">
            <Entypo name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="mb-3" />
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

        <View className="mb-2" />

        <View className="flex flex-row items-center justify-between">
          <TextInput
            label="Amount"
            mode="outlined"
            keyboardType="number-pad"
            className="h-[50px] bg-white flex-1"
          />
          <TouchableOpacity
            onPress={() => {
              setPhotoSelector(true);
              handlePresentModalPress();
            }}
            className="p-1 mx-3 mt-1 bg-slate-50 rounded-md">
            <MaterialIcons name="add-photo-alternate" size={35} color="black" />
          </TouchableOpacity>
        </View>

        <View className="mb-2" />

        <TextInput
          label="Notes"
          mode="outlined"
          multiline={true}
          numberOfLines={4}
          className="bg-white"
        />
        <View className="mb-2" />
        {imageUri && (
          <Image
            source={{ uri: imageUri, width: 150, height: 150 }}
            resizeMethod="auto"
            className="mt-4"
          />
        )}
        <View className="mb-2" />
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
          backgroundColor: 'lightgray',
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
                <FlashList
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
                        setMobileNumber(item.digits);
                        bottomSheetModalRef.current?.dismiss();
                      }}
                      className="p-4 bg-slate-50 mt-2 mx-4 rounded-md flex flex-row items-center w-full h-16">
                      <FontAwesome6 name="mobile-retro" size={24} color="gray" />
                      <View className="ml-4 flex flex-row">
                        <Text variant="titleSmall" className="text-slate-900">
                          {item.digits}
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
                  setMobileNumber(selectedContactItem?.phoneNumbers[0].digits);
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
