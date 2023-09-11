import { FlashList } from '@shopify/flash-list';
import { StatusBar } from 'expo-status-bar';
import { styled } from 'nativewind';
import { useEffect, useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { useCustomersData, usePartyStatement } from '../../../apis/useApi';
import {
  renderHeader,
  renderItem,
  useAuthCompanyStore,
} from '../../../core/utils';
import { useAuth } from '../../../hooks';
import { TwoCards } from '../../Components/TwoCards';
import DropDownFlashList from '../../Components/dropDownFlashList';

export default function Index() {
  const auth = useAuth.use?.token();
  const company = useAuthCompanyStore((state) => state.selectedCompany);
  const { mutate, data: dailyBookData, isLoading } = usePartyStatement();
  const { mutate: customerMutate, data: customersData } = useCustomersData();
  const [reload, setReload] = useState(false);

  const [filteredList, setFilteredList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showOptions, setShowOptions] = useState('');
  const [query, setQuery] = useState('');
  const [fromDate, setFromDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
  );
  const [toDate, setToDate] = useState(new Date());
  const [customersList, setCustomersList] = useState([]);
  const [customer, setCustomer] = useState(null);

  function dateFormat(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  function loadCustomerData() {
    const fromDateStr = dateFormat(fromDate);
    const toDateStr = dateFormat(toDate);
    setReload(true);
    const formData = new FormData();
    formData.append('company_id', company?.id);
    formData.append('cost_center_id', auth.user.cost_center_id);
    if (customer) {
      formData.append('customer_id', customer?.id);
    }
    formData.append('toDate', toDateStr);
    formData.append('fromDate', fromDateStr);
    formData.append('user_id', auth.user.id);
    mutate(formData);
    setReload(false);
  }

  useEffect(() => {
    loadCustomerData();
  }, []);

  useEffect(() => {
    loadCustomerData();
  }, [toDate, fromDate, customer]);

  useEffect(() => {
    if (customersData?.data) {
      let customers = (customersData?.data).map((item) => item.customer);
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

  const handleSearch = (text) => {
    setQuery(text);
    const filtered = (dailyBookData?.data?.transactions).filter((item) =>
      item?.customer?.name?.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredList(filtered);
  };

  useEffect(() => {
    setFilteredList(dailyBookData?.data?.transactions);
  }, [dailyBookData]);

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

  const StyledView = styled(TouchableOpacity);

  const hasRoleOneOrFour = auth?.user?.roles?.some(
    (role) => role.id === 1 || role.id === 4,
  );

  return (
    <View className={'bg-white flex-1'}>
      <StatusBar animated={true} />
      <StyledView className='flex h-15 p-2 bg-blue-50'>
        <View className={'flex flex-row my-2'}>
          <DatePickerInput
            locale='en-GB'
            label='From'
            value={fromDate}
            onChange={(d) => setFromDate(d)}
            inputMode='start'
            mode={'outlined'}
            className={'bg-blue-50 mx-1'}
          />

          <DatePickerInput
            locale='en-GB'
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
              headerTitle='Showing contact from Phonebook'
              onSelect={(contactObj) => {
                setCustomer(contactObj);
              }}
              isTransparent={true}
              filterEnabled={true}
              selectedItemName={customer?.name || ''}
            />
          )}
        </View>
        <TwoCards
          toReceive={dailyBookData?.data?.totalOfTransactions?.toReceive}
          toPay={dailyBookData?.data?.totalOfTransactions?.toPay}
        />
      </StyledView>

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
      {!isLoading ? (
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
          ListHeaderComponent={renderHeader}
          estimatedItemSize={200}
          onSearch={handleSearch}
          onSelect={handleSelect}
          selected={selectedItem}
          showOptions={showOptions}
          options={options}
          refreshing={reload}
          onRefresh={() => loadCustomerData()}
          onOptionSelect={handleOptionSelect}
          ListEmptyComponent={
            <View className={'flex-1 d-flex justify-center items-center h-16'}>
              <Text variant={'bodyMedium'}>No Records Available!</Text>
            </View>
          }
        />
      ) : (
        <ActivityIndicator className={'mt-24'} />
      )}
    </View>
  );
}
