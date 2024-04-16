import { FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { isUndefined } from 'lodash';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, TouchableOpacity, View } from 'react-native';
import { Button, Dialog, Portal, Switch, Text, TextInput } from 'react-native-paper';

import { useCreateCustomer, useGetUserCustomersList, useUpdateCustomer } from '../../apis/use-api';
import { showToast } from '../../core/utils';
import { useAuthStore } from '../../hooks/auth-store';
import { useAuthCompanyStore, useCustomersStore } from '../../hooks/zustand-store';

export const sendWhatsAppMessage = (link) => {
  if (!isUndefined(link)) {
    Linking.canOpenURL(link)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Please install whats app to send direct message to students via whatsapp');
        } else {
          return Linking.openURL(link);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  } else {
    console.log('sendWhatsAppMessage -----> ', 'message link is undefined');
  }
};

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

export const makePhoneCall = (phoneNumber) => {
  const url = `tel:${processString(phoneNumber)}`;
  Linking.canOpenURL(url)
    .then(() => {
      return Linking.openURL(url);
    })
    .catch((error) => console.error(error));
};

function CardComponent({
  id,
  title,
  description,
  isAccountShared,
  iconName,
  makeCall = () => null,
  whatsapp = () => null,
  editContact = () => null,
}) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <>
      <View className="z-10 relative mx-2 mt-2 flex h-16 flex-row items-center justify-between rounded-2xl bg-white px-4 shadow-sm shadow-slate-200">
        <View className="z-10 flex flex-row items-center justify-start">
          <View>
            {iconName === 'bank' ? (
              <MaterialCommunityIcons name="bank-transfer" size={24} color="dodgerblue" />
            ) : (
              <Ionicons name={iconName} size={20} color="dodgerblue" />
            )}
          </View>
          <View className="ml-4">
            <Text variant="titleSmall">{title}</Text>
            <Text variant="bodySmall" className="text-slate-500">
              {description}
            </Text>
          </View>
        </View>
        <View className="flex flex-row py-1.5 mt-2 bg-white shadow-slate-200">
          {/*Edit Button*/}
          <TouchableOpacity
            className="p-2 mx-2"
            onPress={() =>
              editContact({
                id,
                title,
                description,
                isAccountShared,
              })
            }>
            <MaterialCommunityIcons name="pencil" size={18} color="gray" />
          </TouchableOpacity>

          {/*Edit Button*/}
          <TouchableOpacity className="p-2" onPress={() => setShowOptions((show) => !show)}>
            <FontAwesome6
              name={showOptions ? 'chevron-up' : 'chevron-down'}
              size={14}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>
      {showOptions && (
        <>
          {/*<View className="realtive right-6 top-[55px] bg-white h-5 w-5 z-40 my-4" />*/}
          <View className="relative left-[200%] z-40 flex flex-row py-1.5 mt-2 w-[30%] bg-white shadow-slate-200 shadow-sm items-center justify-center rounded-full">
            {/*Call Button*/}
            <TouchableOpacity className="rounded-full bg-blue-100 p-2 mx-2" onPress={makeCall}>
              <MaterialCommunityIcons name="phone" size={18} color="dodgerblue" />
            </TouchableOpacity>

            {/*Whatsapp Button*/}
            <TouchableOpacity className="rounded-full bg-emerald-50 p-2 mx-2" onPress={whatsapp}>
              <MaterialCommunityIcons name="whatsapp" size={18} color="darkgreen" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
  );
}

export default function UserCustomerList({ navigation }) {
  const customerList = useCustomersStore((state) => state.customersList);
  const setCustomerList = useCustomersStore((state) => state.setCustomers);
  const company = useAuthCompanyStore((state) => state.selectedCompany);
  const { user: auth } = useAuthStore();

  const [visible, setVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState({
    title: '',
    description: '',
  });
  const {
    mutate: updateCustomer,
    data: customerUpdateData,
    isLoading: isCustomerLoading,
  } = useUpdateCustomer();

  const {
    mutate: createCustomer,
    data: customerCreateData,
    isLoading: isCustomerCreateLoading,
  } = useCreateCustomer();

  const { data: customersList, isLoading: isCustomerDataLoading } = useGetUserCustomersList(
    auth.user.id
  );

  useEffect(() => {
    if (selectedCustomer) {
      const index = customerList.findIndex((customer) => customer.id === selectedCustomer.id);
      customerList[index] = {
        ...customerList[index],
        name: selectedCustomer.title,
        digits: selectedCustomer.description,
      };
      if (customerUpdateData?.status) {
        setCustomerList(customerList);
        setSelectedCustomer({
          title: '',
          description: '',
        });
        showToast(customerUpdateData?.message, 'success');
      }
    } else {
      if (customerUpdateData) {
        showToast(customerUpdateData?.message, 'error');
      }
    }
  }, [isCustomerLoading, customerUpdateData]);

  useEffect(() => {
    if (!isCustomerCreateLoading && customerCreateData) {
      if (customerCreateData.status) {
        showToast(customerCreateData?.message, 'success');
      } else {
        showToast(customerCreateData?.message, 'error');
      }
      setSelectedCustomer({
        title: '',
        description: '',
      });
    }
  }, [isCustomerCreateLoading, customerCreateData]);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = (value) => setIsEnabled(value);

  return (
    <View className="flex-1 justify-start bg-blue-50">
      {isCustomerDataLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <View className="flex flex-row items-center justify-end px-4">
            <Button
              icon="plus"
              className="w-42 flex-row items-center justify-between"
              mode="contained"
              onPress={() => {
                setSelectedCustomer({
                  title: '',
                  description: '',
                });
                showDialog();
              }}>
              <Text className="ml-2 text-white">Create</Text>
            </Button>
          </View>
          <FlashList
            data={customersList?.data}
            renderItem={({ item, index }) => (
              <CardComponent
                key={index}
                title={item.name}
                id={item.id}
                isAccountShared={item.is_account_shared}
                iconName="person"
                description={item.phone}
                makeCall={() => {
                  makePhoneCall(item.phone);
                }}
                whatsapp={() => {
                  sendWhatsAppMessage(`https://wa.me/91${item.phone}?text=Hello`);
                }}
                editContact={(item) => {
                  console.log(item);
                  showDialog();
                  toggleSwitch(item.isAccountShared === 1);
                  setSelectedCustomer(item);
                }}
              />
            )}
            estimatedItemSize={100}
            ListEmptyComponent={
              <View className="d-flex h-16 flex-1 items-center justify-center">
                <Text variant="bodyMedium">No Records Available!</Text>
              </View>
            }
            ListFooterComponent={<View className="h-16" />}
          />
        </>
      )}
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog} className="rounded bg-white">
          <Dialog.Title style={{ fontSize: 18 }} className="font-semibold">
            {selectedCustomer.id ? 'Edit Customer Details' : 'Create Customer'}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              className="bg-white"
              value={selectedCustomer?.title}
              onChangeText={(text) => {
                setSelectedCustomer({
                  ...selectedCustomer,
                  title: text,
                });
              }}
              label="Customer Name"
            />
            <View className="mt-2" />
            <TextInput
              keyboardType="numeric"
              mode="outlined"
              className="bg-white"
              value={selectedCustomer?.description}
              onChangeText={(text) => {
                setSelectedCustomer({
                  ...selectedCustomer,
                  description: text,
                });
              }}
              label="Mobile Number"
            />
            <View className="mt-3 flex flex-row items-center justify-between">
              <Text>Shared Account</Text>
              <Switch
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="contained"
              className="rounded px-6"
              loading={selectedCustomer.id ? isCustomerLoading : isCustomerCreateLoading}
              onPress={() => {
                hideDialog();
                if (selectedCustomer && selectedCustomer.title !== '' && selectedCustomer.id) {
                  updateCustomer(selectedCustomer);
                } else {
                  if (selectedCustomer.title === '') {
                    showToast('Please enter customer name', 'error');
                    return false;
                  }

                  // if (selectedCustomer.description === '') {
                  //   showToast('Please enter mobile number', 'error');
                  //   return false;
                  // }
                  if (company) {
                    createCustomer({
                      title: selectedCustomer.title,
                      description: selectedCustomer.description,
                      company_id: company.id,
                      cost_center_id: auth.user.cost_center_id,
                      user_id: auth.user.id,
                    });
                  } else {
                    createCustomer({
                      title: selectedCustomer.title,
                      description: selectedCustomer.description,
                      user_id: auth.user.id,
                    });
                  }
                }
              }}>
              {selectedCustomer.id ? 'Update' : 'Create'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
