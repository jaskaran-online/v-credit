import { FlashList } from '@shopify/flash-list';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';

import { useAllTransactions, useCustomersData } from '../../apis/use-api';
import { renderHeader, renderItem } from '../../components/list-components';
import { useAuthStore } from '../../hooks/auth-store';
import { useAuthCompanyStore } from '../../hooks/zustand-store';
import { EmptyList, FlashListFooter, DetailCards, DropDownFlashList } from '../components';
import { styles } from '../styles';

export default function AllTransactions() {
  const { user: auth } = useAuthStore();
  const company = useAuthCompanyStore((state) => state.selectedCompany);
  const { mutate: customerMutate, data: customersData } = useCustomersData();
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
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [toDate, setToDate] = useState(new Date());
  const [customersList, setCustomersList] = useState([]);

  useEffect(() => {
    if (customersData?.data) {
      const customers = (customersData?.data).map((item) => item.customer);
      setCustomersList(customers);
    }
  }, [customersData]);

  function fetchCustomers() {
    const formData = new FormData();
    formData.append('cost_center_id', auth?.user.cost_center_id);
    formData.append('company_id', company?.id);
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
    formData.append('company_id', company?.id);
    formData.append('cost_center_id', auth.user.cost_center_id);
    if (customer) {
      formData.append('customer_id', customer?.id);
    }
    if (transactionType) {
      formData.append('transaction_type_id', transactionType);
    }
    formData.append('toDate', toDateStr);
    formData.append('fromDate', fromDateStr);
    formData.append('user_id', auth.user.id);
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
      onPress: handleFilterPaymentReceived,
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
      item?.customer?.name?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredList(filtered);
  };

  const handleClearSelection = () => {
    setSelectedItem(null);
  };

  const handleFilterPaymentReceived = () => {
    const filtered = filteredList.filter((item) => item.id !== selectedItem.id);
    setFilteredList(filtered);
    setSelectedItem(null);
  };

  const handleEditSelectedItem = () => {
    setSelectedItem(null);
  };

  const hasRoleOneOrFour = auth?.user?.roles?.some((role) => role.id === 1 || role.id === 4);

  return (
    <View className="flex-1 bg-white">
      <StatusBar animated />
      <View className="h-15 flex bg-blue-50 p-2">
        <View className="mb-2 flex flex-row">
          <DatePickerInput
            locale="en-GB"
            label="From"
            value={fromDate}
            onChange={(d) => setFromDate(d)}
            inputMode="start"
            mode="outlined"
            className="mx-1 bg-blue-50"
          />

          <DatePickerInput
            locale="en-GB"
            label="To"
            value={toDate}
            onChange={(d) => setToDate(d)}
            inputMode="start"
            mode="outlined"
            className="mx-1 bg-blue-50"
          />
        </View>
        <View>
          {customersList.length > 0 && (
            <DropDownFlashList
              data={customersList}
              inputLabel="Parties"
              headerTitle="Showing list of parties"
              onSelect={(contactObj) => {
                setCustomer(contactObj);
              }}
              isTransparent
              filterEnabled
              selectedItemName={customer?.name || ''}
            />
          )}
          <View className="mt-2" />
          <DropDownFlashList
            data={[
              { id: 0, name: 'All' },
              { id: 1, name: 'To Receive' },
              { id: 2, name: 'To Pay' },
            ]}
            inputLabel="Transaction Type"
            headerTitle="Transaction Type"
            onSelect={(contactObj) => {
              setTransactionType(contactObj?.id);
            }}
            isTransparent
            filterEnabled
            enableSearch={false}
            selectedItemName={transactionType?.name || ''}
          />
        </View>
        <DetailCards
          toReceive={transactionsData?.data?.totalOfTransactions?.toReceive}
          toPay={transactionsData?.data?.totalOfTransactions?.toPay}
        />
      </View>
      {transactionsData?.data ? (
        <>
          <View className="flex w-full flex-row items-center justify-between px-3 py-4">
            <Searchbar
              onChangeText={handleSearch}
              value={query.toString()}
              style={styles.searchBarStyle}
              inputStyle={styles.searchBarInputStyle}
              placeholder="Search Name, Amount or Txn Note"
              className="h-10 border-2 border-slate-200 bg-white"
            />
          </View>
          <View style={styles.flashListContainer}>
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
                    isAdmin: hasRoleOneOrFour,
                  })
                }
                refreshing={reload}
                ListHeaderComponent={renderHeader}
                estimatedItemSize={200}
                onSearch={handleSearch}
                onSelect={handleSelect}
                selected={selectedItem}
                showOptions={showOptions}
                options={options}
                onOptionSelect={handleOptionSelect}
                ListFooterComponent={<FlashListFooter />}
                ListEmptyComponent={<EmptyList />}
              />
            )}
          </View>
        </>
      ) : (
        <ActivityIndicator className="mt-24" />
      )}
    </View>
  );
}
