import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Platform, TouchableOpacity, View } from 'react-native';
import { Button, Dialog, Portal, Searchbar, Text } from 'react-native-paper';

import {
  useTotalTransactionData,
  useTransactionsData,
  useTransactionsDelete,
  useUserTodayTransactions,
} from '../../../apis/use-api';
import { renderHeader, renderItem } from '../../../components/list-components';
import SkeletonPlaceholder from '../../../components/skeleton-placeholder ';
import { showToast } from '../../../core/utils';
import { useAuthStore } from '../../../hooks/auth-store';
import {
  useAuthCompanyStore,
  useCardAmountStore,
  useFilterToggleStore,
} from '../../../hooks/zustand-store';

export default function Transactions() {
  const currentPageRef = useRef(0);
  const lastPageRef = useRef(1);

  const { user: auth } = useAuthStore();
  const setCardAmount = useCardAmountStore((state) => state.setCardAmount);
  const { mutate: transactionRequest, data: transactionData, isLoading } = useTransactionsData();
  const {
    data: userTransactionData,
    isLoading: userTransactionLoading,
    fetchNextPage,
    refetch,
  } = useUserTodayTransactions(auth?.user?.id);

  console.log(userTransactionLoading, 'userTransactionLoading');
  console.log(userTransactionData?.transactions?.data, 'userTransactionData');

  // Use object destructuring for more concise code
  const {
    mutate: cardRequest,
    data: cardData,
    isLoading: isCardLoading,
  } = useTotalTransactionData();

  const {
    mutate: transactionDelRequest,
    isLoading: transactionDelLoading,
    isSuccess: transactionDelSuccess,
  } = useTransactionsDelete();

  const [reload, setReload] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [query, setQuery] = useState('');
  const [orderedData, setOrderedData] = useState([]);
  const [filterBy, setFilteredBy] = useState('Clear');
  const [deleteModalVisibility, setDeleteModalVisibility] = useState(null);
  const company = useAuthCompanyStore((state) => state.selectedCompany);

  useEffect(() => {
    if (transactionDelLoading) {
      setDeleteModalVisibility(null);
    }
  }, [transactionDelLoading]);

  useEffect(() => {
    lastPageRef.current = transactionData?.transactions?.last_page;
    if (transactionData?.transactions?.data) {
      const newTransactions = transactionData?.transactions?.data;
      const mergedArray = [...newTransactions, ...orderedData];

      // Remove duplicates
      let uniqueTransactions = mergedArray.reduce((acc, current) => {
        const x = acc.find((item) => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      switch (filterBy) {
        case 'Clear':
        case 'Show All Records':
          setOrderedData(uniqueTransactions);
          setShowOptions(false);
          break;
        case 'Payment Received':
        case 'Credit Given':
          uniqueTransactions.sort((a, b) => {
            const sortOrder = filterBy === 'Payment Received' ? -1 : 1;
            return sortOrder * (a.transaction_type_id - b.tlogransaction_type_id);
          });
          setOrderedData(uniqueTransactions);
          setShowOptions(false);
          break;
        case 'Show My Records':
          uniqueTransactions = uniqueTransactions.filter((item) => item.user_id === auth?.user?.id);
          setOrderedData(uniqueTransactions);
          setShowOptions(false);
          break;
        default:
          console.log('Unknown filter');
          break;
      }
    }
  }, [filterBy, transactionData, orderedData, auth?.user?.id]);

  useEffect(() => {
    if (company) {
      setFilteredList(orderedData);
    } else {
      setFilteredList(userTransactionData?.transactions?.data);
    }
  }, [orderedData, company, userTransactionData]);

  useFocusEffect(
    useCallback(() => {
      if (company) {
        loadTransactions();
      }
    }, [company, loadTransactions])
  );

  const getCardTotals = useCallback(() => {
    if (company && auth?.user) {
      const formData = new FormData();
      formData.append('company_id', company?.id);
      formData.append('cost_center_id', auth.user.cost_center_id);
      formData.append('user_id', auth.user.id);
      cardRequest(formData);
    }
  }, [auth.user, company, cardRequest]);

  const toggleFilter = useFilterToggleStore((state) => state.toggleFilter);

  useEffect(() => {
    if (company) {
      loadTransactions();
      getCardTotals();
    }
  }, [company, getCardTotals, loadTransactions, transactionDelSuccess]);

  function loadTransactions(page = 1) {
    setReload(true);
    const formData = new FormData();
    formData.append('company_id', company?.id);
    formData.append('cost_center_id', auth.user.cost_center_id);
    formData.append('user_id', auth.user.id);
    formData.append('page', page);
    transactionRequest({ formData, page });
    setReload(false);
    toggleFilter('none');
  }

  const options = [
    { label: 'Credit Given', onPress: () => setFilteredBy('Credit Given') },
    {
      label: 'Payment Received',
      onPress: () => setFilteredBy('Payment Received'),
    },
    {
      label: 'Show All Records',
      onPress: () => setFilteredBy('Show All Records'),
    },
    {
      label: 'Show My Records',
      onPress: () => setFilteredBy('Show My Records'),
    },
    {
      label: 'Clear Filter',
      onPress: () => {
        setFilteredBy('Clear');
        setShowOptions(false);
      },
    },
  ];

  const handleSearch = (text) => {
    setQuery(text);
    const filtered = orderedData.filter((item) =>
      item?.customer?.name?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredList(filtered);
  };

  const handleOptionSelect = () => {
    setShowOptions((show) => !show);
  };

  const hasRoleOneOrFour = auth?.user?.roles?.some((role) => role.id === 1 || role.id === 4);

  function handleDeleteRecord(deleteModel) {
    transactionDelRequest({
      id: deleteModel?.id,
      user_id: auth?.user?.id,
    });
    showToast('Record Deleted Successfully', 'success');
    toggleFilter('none');
  }

  function handleLoadMore() {
    currentPageRef.current = currentPageRef.current + 1;
    if (lastPageRef.current >= currentPageRef.current) {
      loadTransactions(currentPageRef.current);
    }
  }

  useEffect(() => {
    if (cardData?.data) {
      setCardAmount({
        toReceive: cardData?.data?.toReceive,
        toPay: cardData?.data?.toPay,
      });
    }
  }, [cardData, isCardLoading, setCardAmount]);

  return (
    <View className="flex-1 bg-white">
      <View className="flex w-full flex-row items-center justify-between px-3 py-4">
        <View className="relative flex flex-row" style={{ width: '80%' }}>
          <Searchbar
            onChangeText={handleSearch}
            value={query.toString()}
            style={{
              width: '100%',
              backgroundColor: 'white',
            }}
            inputStyle={{
              fontSize: 12,
              lineHeight: Platform.OS === 'android' ? 16 : 0,
              paddingBottom: 20,
            }}
            placeholder="Search Name, Amount or Txn Note"
            className="h-10 border-2 border-slate-200 bg-white"
          />
        </View>
        <View className="flex" style={{ width: '15%', marginRight: 10 }}>
          {options && (
            <Button
              onPress={() => handleOptionSelect(true)}
              className={`${
                filterBy === 'Clear' ? 'bg-white' : 'bg-blue-600'
              }  mr-2 rounded-full border-2 shadow-sm`}>
              <MaterialCommunityIcons
                name="account-filter"
                size={22}
                color={filterBy === 'Clear' ? 'black' : 'white'}
              />
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
          className="right-10 top-14 border-2 border-slate-100 shadow-lg shadow-black">
          {options.map((value, key) => {
            return (
              <TouchableOpacity
                key={key}
                onPress={value.onPress}
                className={value.label === filterBy ? 'bg-slate-200' : 'bg-white'}>
                <Text variant="labelLarge" className="py-2 pl-2 pr-4">
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
          renderItem({
            item,
            index,
            userId: auth.user.id,
            isAdmin: hasRoleOneOrFour,
            showDelete: true,
            onDelete: (itemToDelete = null) => {
              setDeleteModalVisibility(itemToDelete);
            },
          })
        }
        ListHeaderComponent={renderHeader}
        estimatedItemSize={600}
        refreshing={reload}
        onRefresh={company !== null ? loadTransactions : refetch}
        onSearch={handleSearch}
        showOptions={showOptions}
        options={options}
        onOptionSelect={handleOptionSelect}
        onEndReachedThreshold={0.9}
        ListFooterComponent={() => (
          <View className="mt-4">
            {isLoading ? (
              <View className="flex flex-row items-center justify-between mb-4 pt-[6px] px-3">
                <View className="flex-1 flex-row items-center gap-2">
                  <View>
                    <SkeletonPlaceholder borderRadius={100} height={25} width={25} />
                  </View>
                  <View>
                    <SkeletonPlaceholder borderRadius={10} height={10} width={160} />
                    <SkeletonPlaceholder borderRadius={10} height={10} width={160} />
                  </View>
                </View>
                <View className="mr-2">
                  <SkeletonPlaceholder borderRadius={10} height={5} width={90} />
                  <SkeletonPlaceholder borderRadius={10} height={5} width={90} />
                </View>
              </View>
            ) : (
              lastPageRef.current <= currentPageRef.current &&
              lastPageRef.current > 1 && (
                <Text variant="labelLarge" className="text-center text-slate-800">
                  {' '}
                  No more data available!
                </Text>
              )
            )}
          </View>
        )}
        onEndReached={company !== null ? handleLoadMore : fetchNextPage}
        ListEmptyComponent={
          <View className="d-flex h-16 flex-1 items-center justify-center">
            <Text variant="bodyMedium">No Records Available!</Text>
          </View>
        }
      />

      <Portal>
        <Dialog visible={deleteModalVisibility !== null} className="rounded bg-white">
          <Dialog.Title style={{ fontSize: 14 }} className="font-bold">
            Are you sure you want to delete ?
          </Dialog.Title>
          <Dialog.Content style={{ minHeight: 100 }}>
            <View className="flex-row items-center justify-center">
              <Image
                source={{
                  uri: 'https://assets-v2.lottiefiles.com/a/e09820ea-116b-11ee-8e93-4f2a1602d144/HdbA8EJlUN.gif',
                  width: 100,
                  height: 100,
                }}
                className="my-2"
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="contained"
              className="rounded bg-red-500 px-4"
              onPress={() => handleDeleteRecord(deleteModalVisibility)}
              loading={transactionDelLoading}>
              {transactionDelLoading ? 'Please wait' : 'Agree'}
            </Button>
            <Button
              mode="contained"
              className="rounded bg-gray-800 px-4"
              onPress={() => setDeleteModalVisibility(null)}>
              <Text>Cancel</Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
