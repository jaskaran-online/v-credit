import {Feather, MaterialCommunityIcons} from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import {Button, Searchbar, Text} from 'react-native-paper';
import { useTransactionsData } from '../../../apis/useApi';
import { renderHeader, renderItem } from '../../../core/utils';
import { useAuth } from '../../../hooks';
import {COLORS} from "../../../core";
import {useAuthCompanyStore} from "../../../navigations/drawer-navigator";

export default function Index() {
  const auth = useAuth.use?.token();
  const {
    mutate: transactionRequest,
    data: transactionData,
    isLoading,
  } = useTransactionsData();

  const [reload, setReload] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [query, setQuery] = useState('');
  const [orderedData, setOrderedData] = useState([]);
  const [filterBy, setFilteredBy] = useState('Clear');
  const company = useAuthCompanyStore((state) => state.selectedCompany);

  useEffect(() => {
    if (transactionData?.data) {
      if (filterBy === 'Clear') {
        setOrderedData(transactionData?.data);
      } else {
        const orderedArray = _.orderBy(
          transactionData?.data,
          ['transaction_type_id'],
          [filterBy === 'Payment Received' ? 'desc' : 'asc'],
        );
        setOrderedData(orderedArray);
      }
    }
  }, [filterBy, transactionData, isLoading]);

  useEffect(() => {
    setFilteredList(orderedData);
  }, [orderedData]);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [company]),
  );

  function loadTransactions() {
    setReload(true);
    const formData = new FormData();
    formData.append('company_id', company?.id);
    formData.append('cost_center_id', auth.user.cost_center_id);
    transactionRequest(formData);
    setReload(false);
  }

  const options = [
    { label: 'Credit Given', onPress: () => setFilteredBy('Credit Given') },
    {
      label: 'Payment Received',
      onPress: () => setFilteredBy('Payment Received'),
    },
    {
      label: 'Clear',
      onPress: () => {
        setFilteredBy('Clear');
        setShowOptions(false);
      },
    },
  ];

  const handleSearch = (text) => {
    setQuery(text);
    const filtered = orderedData.filter((item) =>
      item?.customer?.name?.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredList(filtered);
  };

  const handleOptionSelect = () => {
    setShowOptions((show) => !show);
  };

  return (
    <View className={'bg-white flex-1'}>
      <View
        className={
          'flex flex-row justify-between w-full px-3 items-center py-4'
        }
      >
        <View className={'flex flex-row relative'} style={{ width: '80%' }}>
          <Searchbar
            onChangeText={handleSearch}
            value={query.toString()}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
            }}
            inputStyle={{
              fontSize: 12,
              lineHeight: Platform.OS === 'android' ? 16 : 0,
              paddingBottom: 20,
            }}
            placeholder='Search Name, Amount or Txn Note'
            className={'bg-white border-2 border-slate-200 h-10'}
          />
        </View>
        <View className={'flex'} style={{ width: '15%', marginRight: 10 }}>
          {options && (
        <Button onPress={() => handleOptionSelect(true)} className={'bg-white rounded-full mr-2 border-2 shadow-sm'}>
              <MaterialCommunityIcons  name='account-filter' size={22} color='black' />
        </Button>
          )}
        </View>
      </View>
      {showOptions && (
        <View
          style={{
            flex: 1,
            position: 'absolute',
            zIndex: 9999999,
            backgroundColor: 'white',
          }}
          className={
            'border-2 border-slate-100 shadow-black shadow-lg right-10 top-14'
          }
        >
          {options.map((value, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={value.onPress}
                className={
                  value.label === filterBy ? 'bg-slate-200' : 'bg-white'
                }
              >
                <Text variant={'labelLarge'} className={'pl-2 pr-4 py-2'}>
                  {value.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
      <FlashList
        data={filteredList || []}
        renderItem={({ item, index }) =>
          renderItem({ item, index, userId: auth.user.id })
        }
        ListHeaderComponent={renderHeader}
        estimatedItemSize={200}
        refreshing={reload}
        onRefresh={loadTransactions}
        onSearch={handleSearch}
        showOptions={showOptions}
        options={options}
        onOptionSelect={handleOptionSelect}
        ListFooterComponent={<View style={{ height: 100 }} />}
        ListEmptyComponent={
          <View className={'flex-1 d-flex justify-center items-center h-16'}>
            <Text variant={'bodyMedium'}>No Records Available!</Text>
          </View>
        }
      />
    </View>
  );
}
