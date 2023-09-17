import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, TouchableOpacity, View, Platform } from 'react-native';
import { Button, Dialog, Portal, Searchbar, Text } from 'react-native-paper';
import {
  useTotalTransactionData,
  useTransactionsData,
  useTransactionsDelete,
} from '../../../apis/useApi';
import {
  renderHeader,
  renderItem,
  showToast,
  useAuthCompanyStore,
  useCardAmountStore,
  useFilterToggleStore,
} from '../../../core/utils';
import { useAuth } from '../../../hooks';

export default function Index() {
  const auth = useAuth.use?.token();
  let setCardAmount = useCardAmountStore((state) => state.setCardAmount);
  const {
    mutate: transactionRequest,
    data: transactionData,
    isLoading,
  } = useTransactionsData();
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
    if (transactionData?.data) {
      let orderedArray = [...transactionData.data]; // Create a copy of the array

      switch (filterBy) {
        case 'Clear':
        case 'Show All Records':
          setOrderedData(orderedArray);
          setShowOptions(false);
          break;
        case 'Payment Received':
        case 'Credit Given':
          orderedArray.sort((a, b) => {
            const sortOrder = filterBy === 'Payment Received' ? -1 : 1;
            return sortOrder * (a.transaction_type_id - b.transaction_type_id);
          });
          setOrderedData([...orderedArray]); // Update the state with the sorted array
          setShowOptions(false);
          break;
        case 'Show My Records':
          orderedArray = orderedArray.filter(
            (item) => item.user_id === auth?.user?.id,
          );
          setOrderedData([...orderedArray]); // Update the state with the filtered array
          setShowOptions(false);
          break;
        default:
          console.log('Unknown filter');
          break;
      }
    }
  }, [filterBy, transactionData, isLoading]);

  useEffect(() => {
    setFilteredList(orderedData);
  }, [orderedData]);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [company, transactionDelSuccess]),
  );

  const getCardTotals = useCallback(() => {
    if (company && auth?.user) {
      const formData = new FormData();
      formData.append('company_id', company?.id);
      formData.append('cost_center_id', auth.user.cost_center_id);
      formData.append('user_id', auth.user.id);
      cardRequest(formData);
    }
  }, [auth.user, company, cardRequest, transactionDelSuccess]);

  let toggleFilter = useFilterToggleStore((state) => state.toggleFilter);

  useEffect(() => {
    loadTransactions();
    getCardTotals();
  }, [transactionDelSuccess]);

  function loadTransactions() {
    setReload(true);
    const formData = new FormData();
    formData.append('company_id', company?.id);
    formData.append('cost_center_id', auth.user.cost_center_id);
    formData.append('user_id', auth.user.id);
    transactionRequest(formData);
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
      item?.customer?.name?.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredList(filtered);
  };

  const handleOptionSelect = () => {
    setShowOptions((show) => !show);
  };

  const hasRoleOneOrFour = auth?.user?.roles?.some(
    (role) => role.id === 1 || role.id === 4,
  );

  function handleDeleteRecord(deleteModalVisibility) {
    transactionDelRequest({
      id: deleteModalVisibility?.id,
      user_id: auth?.user?.id,
    });
    showToast('Record Deleted Successfully', 'success');
    toggleFilter('none');
  }

  useEffect(() => {
    if (cardData?.data) {
      setCardAmount({
        toReceive: cardData?.data?.toReceive,
        toPay: cardData?.data?.toPay,
      });
    }
  }, [cardData, isCardLoading]);

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
            placeholder="Search Name, Amount or Txn Note"
            className={'bg-white border-2 border-slate-200 h-10'}
          />
        </View>
        <View className={'flex'} style={{ width: '15%', marginRight: 10 }}>
          {options && (
            <Button
              onPress={() => handleOptionSelect(true)}
              className={`${
                filterBy === 'Clear' ? 'bg-white' : 'bg-blue-600'
              }  rounded-full mr-2 border-2 shadow-sm`}
            >
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
          renderItem({
            item,
            index,
            userId: auth.user.id,
            isAdmin: hasRoleOneOrFour,
            showDelete: true,
            onDelete: (item = null) => {
              setDeleteModalVisibility(item);
            },
          })
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

      <Portal>
        <Dialog
          visible={deleteModalVisibility !== null}
          className={'bg-white rounded'}
        >
          <Dialog.Title style={{ fontSize: 14 }} className={'font-bold'}>
            Are you sure you want to delete ?
          </Dialog.Title>
          <Dialog.Content style={{ minHeight: 100 }}>
            <View className={'flex-row justify-center items-center'}>
              <Image
                source={{
                  uri: 'https://assets-v2.lottiefiles.com/a/e09820ea-116b-11ee-8e93-4f2a1602d144/HdbA8EJlUN.gif',
                  width: 100,
                  height: 100,
                }}
                className={'my-2'}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode={'contained'}
              className={'px-4 rounded bg-red-500'}
              onPress={() => handleDeleteRecord(deleteModalVisibility)}
              loading={transactionDelLoading}
            >
              {transactionDelLoading ? 'Please wait' : 'Agree'}
            </Button>
            <Button
              mode={'contained'}
              className={'px-4 rounded bg-gray-800'}
              onPress={() => setDeleteModalVisibility(null)}
            >
              Cancel
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
