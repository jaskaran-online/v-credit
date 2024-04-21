import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { memo, useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { Button, Searchbar, Text } from 'react-native-paper';

import Avatar from './avatar';
import navigations from '../navigations';

const ContactList = ({ contacts, onSelect, onscroll }) => {
  const [query, setQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState(contacts || []);

  function searchItem(text) {
    const newData = contacts?.filter((item) => {
      const nameData = `${item?.name?.toUpperCase()}`;
      const phoneData = `${item?.phoneNumbers[0]?.number?.replaceAll('-', '').replaceAll(' ', '')}`;
      const textData = text.toUpperCase();
      return nameData.indexOf(textData) > -1 || phoneData.indexOf(textData) > -1;
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
        placeholder="Search Customer Name or Phone"
        className="h-12 border-2 border-slate-200 bg-white"
      />

      <View>
        <Button
          mode="contained"
          className="my-3 bg-green-950"
          onPress={() => {
            navigations.navigate('Customers');
          }}>
          <Text variant="bodyMedium" className="text-white ">
            Create New
          </Text>
        </Button>
      </View>

      <BottomSheetFlatList
        onScroll={onscroll}
        estimatedItemSize={1000}
        data={filteredContacts}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item, index: i }) => {
          const name = item.name;
          const phone =
            item.phoneNumbers.length > 0
              ? item.phoneNumbers[0].number.replaceAll('-', '').replaceAll(' ', '')
              : '';
          const searchTerm = query?.toUpperCase();
          const nameIndex = name?.toUpperCase().indexOf(searchTerm);
          const phoneIndex = phone?.indexOf(searchTerm);

          if (nameIndex === -1 && phoneIndex === -1) {
            return null;
          }

          const indexToUse = nameIndex !== -1 ? nameIndex : phoneIndex;
          const start =
            indexToUse !== -1 ? (nameIndex !== -1 ? name : phone).slice(0, indexToUse) : '';
          const highlight =
            indexToUse !== -1
              ? (nameIndex !== -1 ? name : phone).slice(indexToUse, indexToUse + searchTerm.length)
              : '';
          const end =
            indexToUse !== -1
              ? (nameIndex !== -1 ? name : phone).slice(indexToUse + searchTerm.length)
              : '';

          return (
            <TouchableOpacity
              key={i}
              onPress={() => onSelect(item)}
              className="p-4 bg-slate-50 mt-1 mx-2 rounded-md flex flex-row items-center w-full">
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
                  {(item.phoneNumbers.length > 0 &&
                    item.phoneNumbers[0].number?.replaceAll('-', '')?.replaceAll(' ', '')) || (
                    <Text className="text-[12px] text-slate-500">Not Available</Text>
                  )}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default memo(ContactList);
