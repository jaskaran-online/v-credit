import { Entypo } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

import { useCreatePurchaseApi, useItemsData } from '../../apis/useApi';
import { showToast, useAuthCompanyStore } from '../../core/utils';
import { useAuth } from '../../hooks/useAuth';

function ListHeaderComponent() {
  return (
    <View className="mb-2 flex-1 items-center justify-center bg-white py-2">
      <Text variant="titleMedium">Select an item</Text>
    </View>
  );
}

function Purchase() {
  const bottomSheetModalRef = useRef(null);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [amount, setAmount] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const auth = useAuth.use?.token();
  const company = useAuthCompanyStore((state) => state.selectedCompany);

  const {
    mutate: createPurchase,
    isLoading: isCreatePurchase,
    data: createPurchaseData,
  } = useCreatePurchaseApi();

  useEffect(() => {
    if (createPurchaseData) {
      if (createPurchaseData?.status) {
        showToast('Purchase created successfully');
      } else {
        showToast('Failed to create purchase', 'error');
      }
    }
    setSelectedItem(null);
    setAmount(false);
    setSelectedDate(new Date());
    setSheetOpen(false);
  }, [createPurchaseData]);

  const { data: itemsData } = useItemsData();

  const snapPoints = useMemo(() => ['60%', '40%'], []);
  const handleFormSubmit = () => {
    Keyboard.dismiss();

    if (!selectedItem) {
      showToast('Please select an item', 'error');
      return;
    }

    if (!amount) {
      showToast('Please enter amount', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('company_id', company?.id);
    formData.append('cost_center_id', auth.user.cost_center_id);
    formData.append('user_id', auth.user.id);
    formData.append(
      'date',
      selectedDate.getFullYear() +
        '-' +
        (selectedDate.getMonth() + 1) +
        '-' +
        selectedDate.getDate(),
    );
    formData.append('item_id', selectedItem?.id);
    formData.append('amount', amount);
    createPurchase(formData);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateChange = (event, date) => {
    hideDatePicker();
    if (date) {
      setSelectedDate(date);
    }
  };

  // callbacks
  const handleSheetChange = useCallback((index) => {
    console.log('handleSheetChange', index);
  }, []);

  const handleSnapPress = useCallback((index) => {
    Keyboard.dismiss();
    if (isSheetOpen) {
      bottomSheetModalRef.current?.close();
      setSheetOpen(false);
    } else {
      bottomSheetModalRef.current?.present();
      setSheetOpen(true);
    }
  }, []);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={2}
        opacity={0.5}
        key={2}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  return (
    <View style={styles.container}>
      {/* Item Selector */}
      <TouchableOpacity style={styles.itemSelector} onPress={() => handleSnapPress(1)}>
        <Text style={styles.itemText}>{!selectedItem ? 'Select Item' : selectedItem.name}</Text>
        <Entypo name="chevron-down" size={22} color="gray" />
      </TouchableOpacity>

      {/* Date Selector */}
      <TouchableOpacity style={styles.itemSelector} onPress={showDatePicker}>
        <Text style={styles.itemText}>{selectedDate.toDateString()}</Text>
        <Entypo name="calendar" size={20} color="gray" />
      </TouchableOpacity>

      {/* Date Picker Component */}
      {isDatePickerVisible && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="inline"
          onChange={handleDateChange}
        />
      )}

      {/* Amount Input */}
      <TextInput
        className="mt-2 h-14 rounded-sm bg-white"
        mode="outlined"
        label="Amount"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={(text) => setAmount(text)}
      />

      {/* Save Button */}
      <Button
        mode="contained"
        onPress={handleFormSubmit}
        className="mt-4 py-2"
        loading={isCreatePurchase}>
        {isCreatePurchase ? 'Saving...' : 'Save'}
      </Button>

      {/* Bottom Sheet */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{
          backgroundColor: '#d2d2d2',
        }}
        onDismiss={() => {
          setSheetOpen(false);
        }}>
        <BottomSheetFlatList
          data={itemsData?.data || []}
          keyExtractor={(i) => i}
          ListHeaderComponent={<ListHeaderComponent />}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                bottomSheetModalRef.current?.close();
                setSelectedItem(item);
              }}
              className="mx-4 flex-row items-center justify-between space-x-2 border-b border-slate-200 px-2 py-3">
              <Text className=" text-slate-800">{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </BottomSheetModal>
    </View>
  );
}

export default memo(Purchase);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 12,
  },
  itemSelector: {
    alignItems: 'center',
    borderColor: 'slategray',
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    height: 56,
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  itemText: {
    fontSize: 16,
  },
});
