import { Entypo, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FlashList } from '@shopify/flash-list';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

import { useBackupGenerate, useBackupList } from '../../apis/use-api';
import { COLORS } from '../../core';
import { showToast } from '../../core/utils';
import { useAuthStore } from '../../hooks/auth-store';
import { useAuthCompanyStore } from '../../hooks/zustand-store';
export default function Backup() {
  const queryClient = useQueryClient();
  const auth = useAuthStore((state) => state.user);
  const selectedCompany = useAuthCompanyStore((state) => state.selectedCompany);
  const { data: backupList, isLoading, refetch, isRefetching } = useBackupList(selectedCompany?.id);
  const { mutate: generateBackup, isLoading: isBackupGenerating, isSuccess } = useBackupGenerate();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
  const [selectedDate2, setSelectedDate2] = useState(new Date());

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries(['useBackupList', selectedCompany?.id]);
      showToast('Backup generated successfully!', 'success');
    }
  }, [isSuccess]);

  const handleDateChange = (event, date) => {
    hideDatePicker();
    if (date) {
      setSelectedDate(date);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateChange2 = (event, date2) => {
    hideDatePicker2();
    if (date2) {
      setSelectedDate2(date2);
    }
  };

  const showDatePicker2 = () => {
    setDatePickerVisibility2(true);
  };

  const hideDatePicker2 = () => {
    setDatePickerVisibility2(false);
  };

  return (
    <View className="flex-1 bg-blue-50">
      <View className="px-5">
        <Text className="text-xl font-bold text-black mb-4">Generate Backups</Text>

        <Text>From Date*</Text>
        {/* Date Selector */}
        <TouchableOpacity style={styles.itemSelector} onPress={showDatePicker}>
          <Text style={styles.itemText}>{selectedDate.toDateString()}</Text>
          <Entypo name="calendar" size={16} color="black" />
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

        {/* Date Selector */}
        <Text>To Date*</Text>
        <TouchableOpacity style={styles.itemSelector} onPress={showDatePicker2}>
          <Text style={styles.itemText}>{selectedDate2.toDateString()}</Text>
          <Entypo name="calendar" size={16} color="black" />
        </TouchableOpacity>
        {/* Date Picker Component */}
        {isDatePickerVisible2 && (
          <DateTimePicker
            value={selectedDate2}
            mode="date"
            display="inline"
            onChange={handleDateChange2}
          />
        )}

        <Button
          isLoading={isBackupGenerating}
          disabled={isBackupGenerating}
          onPress={() => {
            generateBackup({
              company_id: selectedCompany?.id,
              start_date: selectedDate.toISOString().split('T')[0],
              end_date: selectedDate2.toISOString().split('T')[0],
              user_id: auth?.user?.id,
            });
          }}
          mode="contained"
          className="mt-2 rounded-2xl bg-green-800">
          {isBackupGenerating ? 'Generating...' : 'Generate'}
        </Button>
      </View>

      <View className="px-5 mt-8">
        <Text className="text-xl font-bold text-black">Backups List</Text>
      </View>
      {isLoading && <ActivityIndicator size="large" />}
      {!isLoading && (
        <FlashList
          data={backupList?.data?.data || []}
          estimatedItemSize={100}
          onRefresh={() => refetch(selectedCompany?.id)}
          refreshing={isRefetching}
          renderItem={({ item }) => (
            <View className="mx-2 mt-2 flex h-16 flex-row items-center justify-between rounded-2xl bg-white px-4 shadow-sm shadow-slate-200 border border-blue-100">
              <View>
                <Text>{item?.file_name}</Text>
                <View className="flex flex-row gap-2">
                  <Text className="text-[12px] text-slate-800">{item?.date}</Text>
                  <Text className="text-[12px] text-slate-800">{item?.time}</Text>
                </View>
              </View>
              <TouchableOpacity className="px-5" onPress={() => Linking.openURL(item?.file_path)}>
                <MaterialIcons name="cloud-download" size={24} color="black" />
              </TouchableOpacity>
            </View>
          )}
          ListFooterComponent={() => <View className="h-4" />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  itemSelector: {
    alignItems: 'center',
    borderColor: COLORS.slategray,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 6,
    paddingHorizontal: 16,
  },
  itemText: {
    fontSize: 14,
  },
});
