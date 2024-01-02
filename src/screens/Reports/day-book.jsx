import { Feather } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { styled } from 'nativewind';
import { useEffect, useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';

import { useDailyBook } from '../../apis/use-api';
import { renderHeader, renderItem } from '../../components/list-components';
import { useAuth } from '../../hooks';
import { useAuthCompanyStore } from '../../hooks/zustand-store';
import { FlashListFooter, EmptyList, DetailCards } from '../components';
import { styles } from '../styles';

const StyledView = styled(TouchableOpacity);
export default function DayBook() {
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
      <View className="h-40 bg-blue-50">
        <StyledView className="flex h-1/4 bg-blue-50 p-2">
          <DatePickerInput
            locale="en-GB"
            label="Date"
            value={inputDate}
            onChange={(date) => setInputDate(date)}
            inputMode="start"
            mode="outlined"
            className="mx-1 bg-blue-50"
          />
          <DetailCards
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
    formData.append('user_id', auth.user.id);
    mutate(formData);
    setReload(false);
  }

  useEffect(
    function () {
      loadCustomerData();
    },
    [inputDate]
  );

  const handleSearch = (text) => {
    setQuery(text);
    const filtered = (dailyBookData?.data?.transactions).filter((item) =>
      item?.customer?.name?.toLowerCase().includes(text.toLowerCase())
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
    if (dailyBookData) {
      setFilteredList(dailyBookData?.data?.transactions);
    }
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

  const hasRoleOneOrFour = auth?.user?.roles?.some((role) => role.id === 1 || role.id === 4);

  return (
    <View className="flex-1 bg-white">
      <Header />
      <View className="flex w-full flex-row items-center justify-between px-3 py-4">
        <View className="relative flex flex-row" style={{ width: '80%' }}>
          <Searchbar
            onChangeText={handleSearch}
            value={query.toString()}
            style={styles.searchBarStyle}
            inputStyle={styles.searchBarInputStyle}
            placeholder="Search Name, Amount or Txn Note"
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
            backgroundColor: 'white',
          }}
          className="right-10 top-14 border-2 border-slate-100 shadow-lg shadow-black">
          {options.map((value, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={value.onPress}
                className={value.label === 'Clear' ? 'bg-slate-200' : 'bg-white'}>
                <Text variant="labelLarge" className="py-2 pl-2 pr-4">
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
          refreshing={reload}
          selected={selectedItem}
          showOptions={showOptions}
          options={options}
          onOptionSelect={handleOptionSelect}
          ListFooterComponent={<FlashListFooter />}
          ListEmptyComponent={<EmptyList />}
        />
      ) : (
        <ActivityIndicator className="mt-24" />
      )}
    </View>
  );
}
