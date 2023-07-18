import { FlashList } from '@shopify/flash-list';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { useAllTransactions, useCustomersData } from '../../../apis/useApi';
import { renderHeader, renderItem } from '../../../core/utils';
import { useAuth } from '../../../hooks';
import { TwoCards } from '../../Components/TwoCards';
import DropDownFlashList from '../../Components/dropDownFlashList';

export default function Index() {
  const auth = useAuth.use?.token();

  const {
    mutate: customerMutate,
    data: customersData,
  } = useCustomersData();
  const {
    mutate: transactionsMutate,
    data: transactionsData,
    isLoading: transactionsLoading,
  } = useAllTransactions();
  const [reload, setTransactionsReload] = useState(false);

  const [filteredList, setFilteredList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showOptions, setShowOptions] = useState('');
  const [query, setQuery] = useState('');
  const [customer, setCustomer] = useState('');
  const [transactionType, setTransactionType] = useState(null);
  const [fromDate, setFromDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
  );
  const [toDate, setToDate] = useState(new Date());
  const [customersList, setCustomersList] = useState([]);

  useEffect(() => {
    if (customersData?.data) {
      let customers = (customersData?.data).map((item) => item.customer);
      setCustomersList(customers);
    }
  }, [customersData]);

  function fetchCustomers() {
    const formData = new FormData();
    formData.append('cost_center_id', auth?.user.cost_center_id);
    formData.append('company_id', auth?.user.company_id);
    formData.append('user_id', auth?.user.id);
    customerMutate(formData);
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  function dateFormat(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function loadTransactionsData() {
    setTransactionsReload(true);

    const fromDateStr = dateFormat(fromDate);
    const toDateStr = dateFormat(toDate);

    const formData = new FormData();
    formData.append('company_id', auth.user.company_id);
    formData.append('cost_center_id', auth.user.cost_center_id);
    if (customer) {
      formData.append('customer_id', customer?.id);
    }
    if (transactionType) {
      formData.append('transaction_type_id', transactionType);
    }
    formData.append('toDate', toDateStr);
    formData.append('fromDate', fromDateStr);

    transactionsMutate(formData);
    setTransactionsReload(false);
  }

  useEffect(() => {
    loadTransactionsData();
  }, [customer, fromDate, toDate, transactionType]);

  useEffect(() => {
    loadTransactionsData();
  }, []);

  const options = [
    { label: 'Credit Given', onPress: handleClearSelection },
    {
      label: 'Payment Received',
      onPress: handleDeleteSelectedItem,
    },
    { label: 'Clear', onPress: handleEditSelectedItem },
  ];

  const handleSelect = (item) => {
    setSelectedItem(item);
  };

  const handleOptionSelect = () => {
    setShowOptions((show) => !show);
  };

  useEffect(() => {
    setFilteredList(transactionsData?.data?.transactions);
  }, [transactionsData]);

  const handleSearch = (text) => {
    setQuery(text);
    const filtered = (transactionsData?.data?.transactions).filter((item) =>
      item?.customer?.name?.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredList(filtered);
  };

  const handleClearSelection = () => {
    setSelectedItem(null);
  };

  const handleDeleteSelectedItem = () => {
    const filtered = filteredList.filter((item) => item.id !== selectedItem.id);
    setFilteredList(filtered);
    setSelectedItem(null);
  };

  const handleEditSelectedItem = () => {
    setSelectedItem(null);
  };

  return (
    <View className={'bg-white flex-1'}>
      <StatusBar animated={true} />
      <View className='flex h-15 p-2 bg-blue-50'>
        <View className={'flex flex-row mb-2'}>
          <DatePickerInput
            locale='en'
            label='From'
            value={fromDate}
            onChange={(d) => setFromDate(d)}
            inputMode='start'
            mode={'outlined'}
            className={'bg-blue-50 mx-1'}
          />

          <DatePickerInput
            locale='en'
            label='To'
            value={toDate}
            onChange={(d) => setToDate(d)}
            inputMode='start'
            mode={'outlined'}
            className={'bg-blue-50 mx-1'}
          />
        </View>
        <View>
          {customersList.length > 0 && (
            <DropDownFlashList
              data={customersList}
              inputLabel='Parties'
              headerTitle='Showing list of parties'
              onSelect={(contactObj) => {
                setCustomer(contactObj);
              }}
              isTransparent={true}
              filterEnabled={true}
              selectedItemName={customer?.name || ''}
            />
          )}
          <View className={'mt-2'} />
          <DropDownFlashList
            data={[
              { id: 0, name: 'All' },
              { id: 1, name: 'To Receive' },
              { id: 2, name: 'To Pay' },
            ]}
            inputLabel='Transaction Type'
            headerTitle='Transaction Type'
            onSelect={(contactObj) => {
              setTransactionType(contactObj?.id);
            }}
            isTransparent={true}
            filterEnabled={true}
            enableSearch={false}
            selectedItemName={transactionType?.name || ''}
          />
        </View>
        <TwoCards
          toReceive={transactionsData?.data?.totalOfTransactions?.toReceive}
          toPay={transactionsData?.data?.totalOfTransactions?.toPay}
        />
      </View>
      {transactionsData?.data ? (
        <>
          <View
            className={
              'flex flex-row justify-between w-full px-3 items-center py-4'
            }
          >
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
          <View style={{ flex: 1, height: '100%' }}>
            {transactionsLoading ? (
              <ActivityIndicator />
            ) : (
              <FlashList
                data={filteredList}
                renderItem={({ item, index }) =>
                  renderItem({
                    item,
                    index,
                    userId: auth.user.id,
                  })
                }
                ListHeaderComponent={renderHeader}
                estimatedItemSize={200}
                onSearch={handleSearch}
                onSelect={handleSelect}
                selected={selectedItem}
                showOptions={showOptions}
                options={options}
                onOptionSelect={handleOptionSelect}
                ListFooterComponent={<View style={{ height: 100 }} />}
                ListEmptyComponent={
                  <View
                    className={'flex-1 d-flex justify-center items-center h-16'}
                  >
                    <Text variant={'bodyMedium'}>No Records Available!</Text>
                  </View>
                }
              />
            )}
          </View>
        </>
      ) : (
        <ActivityIndicator className={'mt-24'} />
      )}
    </View>
  );
}
