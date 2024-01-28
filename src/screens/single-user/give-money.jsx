import { AntDesign, FontAwesome6 } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Keyboard, Platform, TouchableOpacity, View } from 'react-native';
import { Button, Searchbar, Text } from 'react-native-paper';

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
    <View className="flex-1 px-4">
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
                  {item.phoneNumbers.length > 0 && item.phoneNumbers[0].number}
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

  console.log(selectedContact?.phoneNumbers, selectedMobileNumber);

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
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <View className="mb-3 " />
        <Text className="text-slate-600 mb-1 mt-2">Contact</Text>
        <TouchableOpacity
          onPress={() => {
            handlePresentModalPress();
            setSelectedContact(null);
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

        <View className="mb-3 " />
        {selectedContact && (
          <>
            <Text className="text-slate-600 mb-1 mt-2">Mobile Number</Text>
            <TouchableOpacity
              onPress={
                (selectedContact && selectedContact?.phoneNumbers)?.length > 1
                  ? handlePresentModalPress
                  : () => null
              }
              className="h-[50px] border border-slate-500 bg-white rounded-[4px] flex flex-row items-center px-4 justify-between">
              {selectedContact ? (
                <Text className="text-gray-900">{selectedContact?.phoneNumbers[0].number}</Text>
              ) : (
                <Text className="text-slate-600">Select Mobile Number</Text>
              )}
              {selectedContact?.phoneNumbers.length > 1 && (
                <AntDesign name="down" size={18} color="gray" />
              )}
            </TouchableOpacity>
          </>
        )}
        <View className="mb-3 " />
        <Button
          mode="contained"
          className="mt-2 p-1 justify-center bg-emerald-900"
          onPress={handleSubmit(handleFormSubmit)}>
          <Text className="text-white">Send</Text>
        </Button>
      </View>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdropComponent}
        backgroundComponent={(props) => <BottomSheetBackground {...props} />}
        handleIndicatorStyle={{
          backgroundColor: 'lightgray',
        }}>
        <View className="flex flex-row items-center justify-between px-3">
          <Text variant="titleMedium" className="text-md p-4 my-1">
            Select {selectedContact?.phoneNumbers?.length > 1 ? 'number' : 'contact'}
          </Text>
          <TouchableOpacity
            className=" px-4 py-2 my-1 bg-gray-200 rounded-full flex flex-row items-center gap-x-2"
            onPress={() => {
              setSelectedContact(null);
              bottomSheetModalRef.current?.dismiss();
            }}>
            <Text variant="bodyMedium" className="text-gray-800">
              Close
            </Text>
            <AntDesign name="close" size={16} color="gray" />
          </TouchableOpacity>
        </View>

        {selectedContact?.phoneNumbers?.length > 1 ? (
          <View className="flex-1">
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
                  onPress={() => setSelectedMobileNumber(item)}
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
            }}
            onscroll={() => Keyboard.dismiss()}
          />
        )}
      </BottomSheetModal>
    </View>
  );
}
