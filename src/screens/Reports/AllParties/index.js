import { FlashList } from '@shopify/flash-list';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View, Platform } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { useAllParties, useCustomersData } from '../../../apis/useApi';
import {
  renderHeader,
  renderItem,
  useAuthCompanyStore,
} from '../../../core/utils';
import { useAuth } from '../../../hooks';
import DropDownFlashList from '../../Components/dropDownFlashList';

export default function Index() {
  const auth = useAuth.use?.token();
  const company = useAuthCompanyStore((state) => state.selectedCompany);
  const {
    mutate: allPartiesMutate,
    data: allPartiesData,
    isLoading: allPartiesLoading,
  } = useAllParties();
  const { mutate: customerMutate, data: customersData } = useCustomersData();

  const [, setPartyReload] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showOptions, setShowOptions] = useState('');
  const [query, setQuery] = useState('');
  const [customer, setCustomer] = useState('');
  const [inputDate, setInputDate] = useState(() => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1);
    return currentDate;
  });
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
    formData.append('company_id', company?.id);
    formData.append('user_id', auth?.user.id);
    customerMutate(formData);
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  function loadPartyData() {
    setPartyReload(true);

    const currentDate = inputDate;
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    const formData = new FormData();
    formData.append('company_id', company?.id);
    formData.append('cost_center_id', auth.user.cost_center_id);
    if (customer) {
      formData.append('customer_id', customer?.id);
    }
    formData.append('date', dateString);
    formData.append('user_id', auth.user.id);
    allPartiesMutate(formData);
    setPartyReload(false);
  }

  useEffect(() => {
    loadPartyData();
  }, [customer, inputDate]);

  useEffect(() => {
    loadPartyData();
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
    setFilteredList(allPartiesData?.data?.transactions);
  }, [allPartiesData]);

  const handleSearch = (text) => {
    setQuery(text);
    const filtered = (allPartiesData?.data?.transactions).filter((item) =>
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

  const hasRoleOneOrFour = auth?.user?.roles?.some(
    (role) => role.id === 1 || role.id === 4,
  );

  return (
    <View className={'bg-white flex-1'}>
      <StatusBar animated={true} />
      <View className="flex h-15 p-2 bg-blue-50">
        <View className={'flex flex-row my-2'}>
          <DatePickerInput
            locale="en-GB"
            label="From"
            value={inputDate}
            onChange={(d) => setInputDate(d)}
            inputMode="start"
            mode={'outlined'}
            className={'bg-blue-50 mx-1 w-44'}
          />
        </View>
        {customersList.length > 0 && (
          <DropDownFlashList
            data={customersList}
            inputLabel="Parties"
            headerTitle="Showing contact from Phonebook"
            onSelect={(contactObj) => {
              setCustomer(contactObj);
            }}
            isTransparent={true}
            filterEnabled={true}
            selectedItemName={customer?.name || ''}
          />
        )}
      </View>
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
          placeholder="Search Name, Amount or Txn Note"
          className={'bg-white border-2 border-slate-200 h-10'}
        />
      </View>
      <View style={{ flex: 1, height: '100%' }}>
        {allPartiesLoading ? (
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
    </View>
  );
}
