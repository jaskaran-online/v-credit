import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useEffect, useState, useRef } from 'react';
import {
  Linking,
  Platform,
  Share,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Button, Dialog, Portal, Searchbar, Text } from 'react-native-paper';

import _ from 'lodash';
import {
  useCustomerTransactionData,
  useTransactionsDelete,
} from '../../../apis/useApi';
import {
  renderItem,
  formatDateForMessage,
  renderHeader,
  useAuthCompanyStore,
  showToast,
} from '../../../core/utils';
import { useAuth } from '../../../hooks';
import FloatingButtons from '../../Components/FloatingButton';
import { useInfiniteQuery } from "@tanstack/react-query";


export function processString(input = null) {
  if (input == null || input === '' || input === 'null') {
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
  { date },
) => {
  let messageDate = formatDateForMessage(date);
  let message = `Hi ${name}`;

  if (to_receive_balance < to_pay_balance && balance !== 0) {
    message = `Hi ${name},
          
This is a friendly reminder that you have to pay ${Math.abs(balance).toFixed(
      2,
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
    message: message,
  });
};

export default function Index({ navigation, route }) {

  const pageRef = useRef(1);
  const lastPageRef = useRef(0);
  const toPayRef = useRef(1);
  const toReceiveRef = useRef(1);
  const balanceRef = useRef(0.00);
  const balanceType = useRef("");

  const auth = useAuth.use?.token();
  const { mutate, data, isLoading } = useCustomerTransactionData();
  const { mutate: transactionDelRequest, isLoading: transactionDelLoading } =
    useTransactionsDelete();

  const [orderedData, setOrderedData] = useState([]);
  const [filterBy, setFilteredBy] = useState('Clear');
  const [deleteModalVisibility, setDeleteModalVisibility] = useState(null);
  const hasRoleOneOrFour = auth?.user?.roles?.some(
    (role) => role.id === 1 || role.id === 4,
  );

  function handleLoadMore() {
    pageRef.current += 1;
    if(lastPageRef.current >= pageRef.current) {
      loadCustomerData(pageRef.current);
    }
  }

  function handleDeleteRecord(deleteModalVisibility) {
    transactionDelRequest({
      id: deleteModalVisibility?.id,
      user_id: auth?.user?.id,
    });
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
      if (filterBy === 'Clear') {
        setOrderedData([...orderedData,...(data?.data?.customer?.transactions)]);
        lastPageRef.current = data?.data?.paginator?.last_page;
      } else {
        const orderedArray = _.orderBy(
          data?.data?.customer?.transactions,
          ['transaction_type_id'],
          [filterBy === 'Payment Received' ? 'desc' : 'asc'],
        );
        setOrderedData(orderedArray);
      }
    }
  }, [filterBy, data, isLoading]);

  useEffect(() => {
    setFilteredList(_.sortBy(orderedData, ['date']).reverse());
  }, [orderedData]);

  useEffect(() => {
    loadCustomerData();
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

  function loadCustomerData(pageNo = 1) {
    setReload(true);
    const formData = new FormData();
    formData.append('company_id', company?.id);
    formData.append('cost_center_id', auth.user.cost_center_id);
    formData.append('customer_id', route.params.id);
    formData.append('user_id', auth.user.id);
    formData.append('page', pageNo);
    mutate(formData);
    setReload(false);
  }
  const handleOptionSelect = () => {
    setShowOptions((show) => !show);
  };

  toPayRef.current = parseFloat((data?.data?.customer?.totalToPay || 0).toFixed(2));
  toReceiveRef.current = parseFloat((data?.data?.customer?.totalToReceive || 0).toFixed(2));

  let BgColor = 'bg-slate-400';
  if (toReceiveRef.current > toPayRef.current) {
    balanceRef.current = toReceiveRef.current - toPayRef.current;
    BgColor = 'bg-green-700';
    balanceType.current = 'To Receive';
  } else if (toReceiveRef.current < toPayRef.current) {
    balanceRef.current = toPayRef.current - toReceiveRef.current;
    BgColor = 'bg-red-400';
    balanceType.current = 'To Pay';
  }

  return (
    <View className={'bg-white flex-1'}>
      <View className="bg-blue-50 h-28">
        <View className="mx-2 h-24 bg-white mt-1 rounded-md shadow-sm flex flex-row items-center justify-between px-4">
          <View className="flex flex-row space-x-4 items-center">
            <View className="ml-2">
              <Text variant="bodyMedium" className="text-slate-600 ">
                {balanceType.current}
              </Text>
              <Text variant="bodyLarge" className="text-slate-900 font-bold">
                {Math.abs(balanceRef.current).toFixed(2)} ₹
              </Text>
            </View>
          </View>

          <View className="flex flex-row space-x-3 pr-2 pl-8">
            <TouchableOpacity
              className="bg-red-50 p-2 rounded-full  flex items-center"
              onPress={() =>
                navigation.navigate('DetailsPdf', {
                  id: data?.data?.customer?.id,
                  name: data?.data?.customer?.name,
                })
              }
            >
              <MaterialIcons name="picture-as-pdf" size={22} color="tomato" />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-blue-50 p-2 rounded-full  flex items-center"
              onPress={() => makePhoneCall(data?.data?.customer?.phone)}
            >
              <MaterialIcons name="call" size={22} color="dodgerblue" />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-blue-50 p-2 rounded-full"
              onPress={() =>
                sendWhatsApp(
                  data?.data?.customer,
                  filteredList[filteredList.length - 1],
                )
              }
            >
              <MaterialCommunityIcons name="whatsapp" size={26} color="green" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        className={
          'flex flex-row justify-between w-full px-3 items-center py-4'
        }
      >
        <View className={'flex flex-row relative'} style={{ width: '80%' }}>
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
            className={'bg-white border-2 border-slate-200 h-10'}
          />
        </View>
        <View className={'flex'} style={{ width: '15%' }}>
          {options && (
            <TouchableOpacity
              className="p-2 bg-white border-slate-900 shadow shadow-slate-300 rounded-xl w-[48] mt-1 h-[40] justify-center items-center"
              onPress={() => handleOptionSelect(true)}
            >
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
      {filteredList && (
        <FlashList
          data={filteredList}
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
          onRefresh={loadCustomerData}
          onOptionSelect={handleOptionSelect}
          onEndReached={handleLoadMore}
          alwaysBounceVertical={true}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.7}
          ListFooterComponent={() => (
            <View className={'mt-4'}>
              {isLoading ? (
                <ActivityIndicator animating={isLoading} size="small" />
              ) : ((lastPageRef.current <= pageRef.current) && (lastPageRef.current > 1) ) && (
                <Text variant={'labelLarge'} className={'text-center text-slate-800'}> No more data available!</Text>
              )}
            </View>
          )}
        />
      )}
      <FloatingButtons
        navigation={navigation}
        customer={data?.data?.customer}
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
