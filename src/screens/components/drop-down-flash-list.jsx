import { FlashList } from '@shopify/flash-list';
import React, { memo, useEffect, useState } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

const DropDownFlashList = ({
  data = [],
  onSelect = () => null,
  onChangeInput = () => null,
  inputLabel = 'label',
  headerTitle = 'headerTitle',
  closeDropDown = false,
  isTransparent = false,
  isLoading = false,
  selectedItemName = '',
  enableSearch = true,
  isReadOnly = false,
  width = 'w-full',
}) => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(closeDropDown);
  const [filteredContacts, setFilteredContacts] = useState(data);

  useEffect(() => {
    if (data) {
      setFilteredContacts(data);
    }
  }, [data]);

  const [value, setValue] = useState(selectedItemName);

  const renderSeparator = () => {
    return <View className="border border-slate-100" />;
  };

  const searchItems = (text) => {
    const newData = data?.filter((item) => {
      const itemData = `${item?.name?.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setFilteredContacts(newData);
    setValue(text);
  };

  const renderHeader = () => {
    return (
      <View className="rounded-t-2xl bg-slate-100 p-2 py-3">
        <Text className="text-slate-600">{headerTitle}</Text>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    const name = item.name;
    const searchTerm = value?.toUpperCase();
    const index = name?.toUpperCase().indexOf(searchTerm);
    if (index === -1 && enableSearch) {
      return null;
    }
    const start = name?.slice(0, index);
    const highlight = name?.slice(index, index + searchTerm.length);
    const end = name?.slice(index + searchTerm.length);

    return (
      <TouchableOpacity
        className="z-50 w-full"
        onPress={() => {
          setValue(item.name);
          onSelect(item);
          setIsDropDownOpen(false);
        }}
        style={{ padding: 10 }}>
        {enableSearch ? (
          <Text>
            {start}
            <Text
              style={{
                color: enableSearch ? 'dodgerblue' : 'black',
              }}>
              {highlight}
            </Text>
            {end}
          </Text>
        ) : (
          <Text>{item.name}</Text>
        )}
      </TouchableOpacity>
    );
  };

  let flashListHeight = filteredContacts?.length === 1 ? 100 : filteredContacts?.length * 70;
  if (flashListHeight > Dimensions.get('screen').height) {
    flashListHeight = Dimensions.get('screen').height - 400;
  }
  return (
    <View className={`relative z-50 ${width}`}>
      <TextInput
        className={isTransparent || isReadOnly ? 'bg-blue-50' : 'bg-white'}
        onChangeText={(text) => {
          if (enableSearch) {
            searchItems(text);
          }
          onChangeInput(text);
        }}
        onFocus={() => setIsDropDownOpen(true)}
        value={value}
        mode="outlined"
        label={inputLabel}
        right={
          !isReadOnly && (
            <TextInput.Icon
              icon={isDropDownOpen ? 'close' : 'chevron-down'}
              size={28}
              color={isDropDownOpen ? 'red' : 'gray'}
              onPress={() => {
                if (selectedItemName === '') {
                  setValue('');
                  setFilteredContacts(data);
                } else {
                  setIsDropDownOpen((value) => !value);
                }
              }}
            />
          )
        }
        // onEndEditing={() => setIsDropDownOpen(false)}
        editable={!isReadOnly}
      />
      {isDropDownOpen && !isReadOnly && (
        <View
          style={{
            height: flashListHeight,
          }}
          className="z-50 mt-1 rounded-b-lg rounded-t-2xl border border-slate-200 bg-white shadow-md shadow-slate-400">
          <FlashList
            data={filteredContacts}
            estimatedItemSize={200}
            contentContainerStyle={{
              height: '100%',
            }}
            renderItem={renderItem}
            keyExtractor={(itemValue, index) => index}
            ItemSeparatorComponent={renderSeparator}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={
              <View className="d-flex h-16 flex-1 items-center justify-center">
                <Text variant="bodyMedium">No Records Available!</Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
};

export default memo(DropDownFlashList);
