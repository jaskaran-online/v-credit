import { Feather } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { styled } from 'nativewind';
import { memo, useEffect, useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { useDailyBook } from '../../../apis/useApi';
import { renderHeader, renderItem } from '../../../core/utils';
import { useAuth } from '../../../hooks';
import { TwoCards } from '../../Components/TwoCards';
import {useAuthCompanyStore} from "../../../navigations/drawer-navigator";

const StyledView = styled(TouchableOpacity);
function DayBook() {
  const auth = useAuth.use?.token();
  const company = useAuthCompanyStore((state) => state.selectedCompany);
  const { mutate, data: dailyBookData, isLoading } = useDailyBook();
  const [reload, setReload] = useState(false);
  const [inputDate, setInputDate] = useState(new Date());
  const [filteredList, setFilteredList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showOptions, setShowOptions] = useState('');
  const [query, setQuery] = useState('');

  function Header() {
    return (
      <View className='bg-blue-50 h-40'>
        <StyledView className='flex h-1/4 p-2 bg-blue-50'>
          <DatePickerInput
            locale='en-GB'
            label='Date'
            value={inputDate}
            onChange={(date) => setInputDate(date)}
            inputMode='start'
            mode={'outlined'}
            className={'bg-blue-50 mx-1'}
          />
          <TwoCards
            toReceive={dailyBookData?.data?.totalOfTransactions?.toReceive}
            toPay={dailyBookData?.data?.totalOfTransactions?.toPay}
          />
        </StyledView>
      </View>
    );
  }

  function loadCustomerData() {
    setReload(true);
    const currentDate = inputDate;
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    const formData = new FormData();
    formData.append('company_id', company?.id);
    formData.append('cost_center_id', auth.user.cost_center_id);
    formData.append('date', dateString);

    mutate(formData);
    setReload(false);
  }

  useEffect(function () {
    loadCustomerData();
  }, []);

  useEffect(
    function () {
      loadCustomerData();
    },
    [inputDate],
  );

  const handleSearch = (text) => {
    setQuery(text);
    const filtered = (dailyBookData?.data?.transactions).filter((item) =>
      item?.customer?.name?.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredList(filtered);
  };

  const options = [
    { label: 'Credit Given', onPress: handleClearSelection },
    {
      label: 'Payment Received',
      onPress: handleDeleteSelectedItem,
    },
    { label: 'Clear', onPress: handleEditSelectedItem },
  ];

  useEffect(() => {
    setFilteredList(dailyBookData?.data?.transactions);
  }, [dailyBookData]);

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

  return (
    <View className={'bg-white flex-1'}>
      <Header />
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
        <View className={'flex'} style={{ width: '15%' }}>
          {options && (
            <TouchableOpacity
              className='p-2 bg-white border-slate-900 shadow shadow-slate-300 rounded-xl w-[48] mt-1 h-[40] justify-center items-center'
              onPress={() => handleOptionSelect(true)}
            >
              <Feather name='filter' size={20} color='black' />
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
                  value.label === 'Clear' ? 'bg-slate-200' : 'bg-white'
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
      {!isLoading ? (
        <FlashList
          data={filteredList}
          renderItem={({ item, index }) =>
            renderItem({ item, index, userId: auth.user.id })
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

export default memo(DayBook);
