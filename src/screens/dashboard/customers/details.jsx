import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Linking, Platform, Share, TouchableOpacity, View } from 'react-native';
import { Button, Dialog, Portal, Searchbar, Text } from 'react-native-paper';

import {
  useCustomerTransactionData,
  useCustomerTransactions,
  useTransactionsDelete,
} from '../../../apis/use-api';
import { renderHeader, renderItem } from '../../../components/list-components';
import SkeletonPlaceholder from '../../../components/skeleton-placeholder ';
import { COLORS } from '../../../core';
import { formatDateForMessage, showToast } from '../../../core/utils';
import { useAuthStore } from '../../../hooks/auth-store';
import { useAuthCompanyStore } from '../../../hooks/zustand-store';
import FloatingButtons from '../../components/floating-button';

export function processString(input = null) {
  if (input === null || input === '' || input === 'null') {
    return '';
  }
  // Remove "-", ",", and spaces from the string
  let processedString = input.replace(/[-,\s]/g, '');

  // If the resulting string has a length greater than 10, remove the first three letters
  if (processedString.length > 10) {
    processedString = processedString.substring(3);
  }

  return processedString;
}

const makePhoneCall = (phoneNumber) => {
  const url = `tel:${processString(phoneNumber)}`;
  Linking.canOpenURL(url)
    .then(() => {
      return Linking.openURL(url);
    })
    .catch((error) => console.error(error));
};

const sendWhatsApp = async (
  { to_pay_balance, to_receive_balance, name, balance, id },
  { date }
) => {
  const messageDate = formatDateForMessage(date);
  let message = `Hi ${name}`;

  if (to_receive_balance < to_pay_balance && balance !== 0) {
    message = `Hi ${name},
          
This is a friendly reminder that you have to pay ${Math.abs(balance).toFixed(
      2
    )} ₹ to me as of ${messageDate}.

Thanks,
MyCreditBook
For complete details,
Click : http://mycreditbook.com/udhaar-khata/${id}
      `;
  } else {
    message = `Hi ${name},
          
I will pay ${Math.abs(balance).toFixed(2)}₹ to you.

Thanks,
MyCreditBook
For complete details,
Click : http://mycreditbook.com/udhaar-khata/${id}`;
  }
  await Share.share({
    message,
  });
};

export default function CustomerDetails({ navigation, route }) {
  const { user: auth } = useAuthStore();
  const { mutate, data, isLoading } = useCustomerTransactionData();
  const { mutate: transactionDelRequest, isLoading: transactionDelLoading } =
    useTransactionsDelete();
  const {
    data: transactions,
    refetch,
    fetchNextPage,
  } = useCustomerTransactions(route.params.mobile, auth?.user?.mobile);

  const pageRef = useRef(1);
  const lastPageRef = useRef(0);
  const toPayRef = useRef(route.params?.toPay);
  const toReceiveRef = useRef(route.params?.toReceive);
  const balanceRef = useRef(route.params?.balance);
  const balanceType = useRef(route.params?.balanceType);

  const [orderedData, setOrderedData] = useState([]);
  const [filterBy, setFilteredBy] = useState('Clear');
  const [deleteModalVisibility, setDeleteModalVisibility] = useState(null);
  const hasRoleOneOrFour = auth?.user?.roles?.some((role) => role.id === 1 || role.id === 4);

  // Get QueryClient from the context
  const queryClient = useQueryClient();

  function handleLoadMore() {
    pageRef.current += 1;
    if (lastPageRef.current >= pageRef.current) {
      loadCustomerData(pageRef.current);
    }
  }

  function handleDeleteRecord(deleteModalVisibility) {
    transactionDelRequest({
      id: deleteModalVisibility?.id,
      user_id: auth?.user?.id,
    });

    queryClient.invalidateQueries(['userCustomerList', auth.user.mobile]);
    queryClient.invalidateQueries(['userTodayTransactionsTotal', auth.user.mobile]);
    queryClient.invalidateQueries(['userTodayTransactions', auth.user.mobile]);

    showToast('Record Deleted Successfully', 'success');
    navigation.navigate('HomePage');
  }

  useEffect(() => {
    if (transactionDelLoading) {
      setDeleteModalVisibility(null);
    }
  }, [transactionDelLoading]);

  useEffect(() => {
    if (data?.data) {
      const newTransactions = data?.data?.customer?.transactions;
      if (filterBy === 'Clear') {
        // Merge and filter out duplicates when filterBy is 'Clear'
        const mergedData = [...orderedData, ...newTransactions].reduce((acc, current) => {
          const x = acc.find((item) => item.id === current.id);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        setOrderedData(mergedData);
        lastPageRef.current = data?.data?.paginator?.last_page;
      } else {
        // Apply ordering when filter is other than 'Clear'
        const orderedArray = _.orderBy(
          newTransactions,
          ['transaction_type_id'],
          [filterBy === 'Payment Received' ? 'desc' : 'asc']
        );
        setOrderedData(orderedArray);
      }
    }
  }, [filterBy, data]);

  useEffect(() => {
    if (company) {
      if (orderedData) {
        setFilteredList(_.sortBy(orderedData, ['date']).reverse());
      }
    } else {
      if (transactions) {
        setFilteredList(_.sortBy(transactions?.data?.customer?.transactions, ['date']).reverse());
      }
    }
  }, [company, orderedData, transactions]);

  useEffect(() => {
    if (company) {
      loadCustomerData();
    } else {
      setOrderedData(transactions?.data?.customer?.transactions);
    }
  }, []);

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

  const [filteredList, setFilteredList] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [query, setQuery] = useState('');
  const [reload, setReload] = useState(false);
  const company = useAuthCompanyStore((state) => state.selectedCompany);
  const handleSearch = (inputValue) => {
    setQuery(inputValue);
    // setFilteredList(filteredList);
  };

  const loadCustomerData = useCallback(
    (pageNo = 1) => {
      setReload(true);
      const formData = new FormData();
      formData.append('company_id', company?.id);
      formData.append('cost_center_id', auth.user.cost_center_id);
      formData.append('customer_id', route.params.id);
      formData.append('user_id', auth.user.id);
      formData.append('page', pageNo);
      mutate({ formData, page: pageNo });
      setReload(false);
    },
    [auth, company, route.params.id, mutate]
  );

  const handleOptionSelect = () => {
    setShowOptions((show) => !show);
  };

  toPayRef.current = parseFloat((data?.data?.customer?.totalToPay || 0).toFixed(2));
  toReceiveRef.current = parseFloat((data?.data?.customer?.totalToReceive || 0).toFixed(2));

  // let BgColor = 'bg-slate-400';
  // if (toReceiveRef.current > toPayRef.current) {
  //   balanceRef.current = toReceiveRef.current - toPayRef.current;
  //   BgColor = 'bg-green-700';
  //   balanceType.current = 'Advance';
  // } else if (toReceiveRef.current < toPayRef.current) {
  //   balanceRef.current = toPayRef.current - toReceiveRef.current;
  //   BgColor = 'bg-red-400';
  //   balanceType.current = 'Balance';
  // }

  return (
    <View className="flex-1 bg-white">
      <View className="h-28 bg-blue-50">
        <View className="mx-2 mt-1 flex h-24 flex-row items-center justify-between rounded-md bg-white px-4 shadow-sm">
          <View className="flex flex-row items-center space-x-4">
            <View className="ml-2">
              <Text variant="bodyMedium" className="text-slate-600 ">
                {balanceType.current}
              </Text>
              <Text variant="bodyLarge" className="font-bold text-slate-900">
                {Math.abs(balanceRef.current).toFixed(2)} ₹
              </Text>
            </View>
          </View>

          <View className="flex flex-row space-x-3 pl-8 pr-2">
            {company && (
              <TouchableOpacity
                className="flex items-center rounded-full  bg-red-50 p-2"
                onPress={() =>
                  navigation.navigate('DetailsPdf', {
                    id: data?.data?.customer?.id,
                    name: data?.data?.customer?.name,
                  })
                }>
                <MaterialIcons name="picture-as-pdf" size={22} color="tomato" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="flex items-center rounded-full  bg-blue-50 p-2"
              onPress={() => makePhoneCall(data?.data?.customer?.phone)}>
              <MaterialIcons name="call" size={22} color="dodgerblue" />
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded-full bg-blue-50 p-2"
              onPress={() =>
                sendWhatsApp(data?.data?.customer, filteredList[filteredList.length - 1])
              }>
              <MaterialCommunityIcons name="whatsapp" size={26} color="green" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View className="flex w-full flex-row items-center justify-between px-3 py-4">
        <View className="relative flex flex-row" style={{ width: '80%' }}>
          <Searchbar
            onChangeText={(text) => handleSearch(text)}
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
            placeholder="Search Amount or Txn Note"
            className="h-10 border-2 border-slate-200 bg-white"
          />
        </View>
        <View className="flex" style={{ width: '15%' }}>
          {options && (
            <TouchableOpacity
              className="mt-1 h-[40] w-[48] items-center justify-center rounded-xl border-slate-900 bg-white p-2 shadow shadow-slate-300"
              onPress={() => handleOptionSelect(true)}>
              <Feather name="filter" size={20} color="black" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {showOptions && (
        <View
          style={{
            flex: 1,
            position: 'absolute',
            zIndex: 9999999,
            backgroundColor: COLORS.white,
          }}
          className="right-10 top-14 border-2 border-slate-100 shadow-lg shadow-black">
          {options.map((value, index) => {
            return (
              <TouchableOpacity
                key={index}
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
      {filteredList && (
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
              showPDF: false,
              showCustomerName: false,
            })
          }
          ListHeaderComponent={() => renderHeader({ headerTitle: '' })}
          estimatedItemSize={100}
          showOptions={showOptions}
          options={options}
          refreshing={reload}
          onRefresh={company ? loadCustomerData : refetch}
          onOptionSelect={handleOptionSelect}
          onEndReached={company ? handleLoadMore : fetchNextPage}
          alwaysBounceVertical
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.7}
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
                lastPageRef.current <= pageRef.current &&
                lastPageRef.current > 1 && (
                  <Text variant="labelLarge" className="text-center text-slate-800">
                    {' '}
                    No more data available!
                  </Text>
                )
              )}
            </View>
          )}
        />
      )}
      <FloatingButtons navigation={navigation} customer={data?.data?.customer} />
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
              Cancel
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
