import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { Alert, Linking, TouchableOpacity, View } from 'react-native';
import {Button, Dialog, Portal, Text, TextInput} from 'react-native-paper';
import { useCustomersStore } from '../index';
import { FlashList } from '@shopify/flash-list';
import { isUndefined } from 'lodash';
import {useEffect, useState} from 'react';
import {useGetCustomersList, useUpdateCustomer} from "../../../apis/useApi";
import {showToast} from "../GiveMoney";

export const sendWhatsAppMessage = (link) => {
  if (!isUndefined(link)) {
    Linking.canOpenURL(link)
      .then((supported) => {
        if (!supported) {
          Alert.alert(
            'Please install whats app to send direct message to students via whatsapp',
          );
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
  iconName,
  makeCall = () => null,
  whatsapp = () => null,
  editContact = () => null,
}) {
  return (
    <View
      className={
        'bg-white flex h-16 shadow-sm shadow-slate-200 mx-2 flex-row justify-between items-center px-4 mt-2 rounded-2xl'
      }
    >
      <View className={'flex flex-row justify-start items-center'}>
        <View>
          {iconName === 'bank' ? (
            <MaterialCommunityIcons
              name='bank-transfer'
              size={24}
              color='dodgerblue'
            />
          ) : (
            <Ionicons name={iconName} size={20} color='dodgerblue' />
          )}
        </View>
        <View className={'ml-4'}>
          <Text variant={'titleSmall'}>{title}</Text>
          <Text variant={'bodySmall'} className={'text-slate-500'}>
            {description}
          </Text>
        </View>
      </View>
      <View className={'flex flex-row gap-3'}>

        {/*Edit Button*/}
        <TouchableOpacity
            className='bg-slate-100 p-2 rounded-full'
            onPress={() => editContact({
              id,
              title,
              description})}
        >
          <MaterialCommunityIcons name='pencil' size={18} color='gray' />
        </TouchableOpacity>

        {/*Call Button*/}
        <TouchableOpacity
          className='bg-blue-100 p-2 rounded-full'
          onPress={makeCall}
        >
          <MaterialCommunityIcons name='phone' size={18} color='dodgerblue' />
        </TouchableOpacity>

        {/*Whatsapp Button*/}
        <TouchableOpacity
          className='bg-emerald-50 p-2 rounded-full'
          onPress={whatsapp}
        >
          <MaterialCommunityIcons name='whatsapp' size={18} color='darkgreen' />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function Index({ navigation }) {

  const [visible, setVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const {
    mutate: updateCustomer,
    data: customerUpdateData,
    isLoading: isCustomerLoading,
  } = useUpdateCustomer();

  useEffect(() => {
    if(!isCustomerLoading && customerUpdateData?.status){
      showToast(customerUpdateData?.message, 'success');
      if(selectedCustomer){
        let index = customerList.findIndex(customer => customer.id === selectedCustomer.id);
        customerList[index] = {
          ...customerList[index],
          name : selectedCustomer.title,
          digits : selectedCustomer.description
        };
      }
    }else{
        showToast(customerUpdateData?.  message, 'error');
    }
  }, [isCustomerLoading, customerUpdateData]);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);
  let customerList = useCustomersStore((state) => state.customersList);

  return (
    <View className='flex-1 justify-start bg-blue-50'>
      <FlashList
        data={customerList}
        renderItem={({ item, index }) => (
          <CardComponent
            key={index}
            title={item.name}
            id={item.id}
            iconName='person'
            description={item.digits}
            estimateItemSize={150}
            makeCall={() => makePhoneCall(item.digits)}
            whatsapp={() =>
              sendWhatsAppMessage(`https://wa.me/91${item.digits}?text=Hello`)
            }
            editContact={(item) => {
              showDialog()
              setSelectedCustomer(item);
            }}
          />
        )}
      />

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title className={""}>Edit Customer Details</Dialog.Title>
          <Dialog.Content>
            <TextInput mode={"outlined"} value={selectedCustomer?.title} onChangeText={(text) => {
              setSelectedCustomer({
                ...selectedCustomer,
                title: text
              })
            }} label={"Customer Name"}/>
            <View className='mt-2'/>
            <TextInput keyboardType={"numeric"} mode={"outlined"} value={selectedCustomer?.description} onChangeText={(text) => {
              setSelectedCustomer({
                ...selectedCustomer,
                description: text
              })
            }} label={"Mobile Number"}/>
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode={"contained"} className={"px-4"} loading={isCustomerLoading} onPress={()=> {
              hideDialog();
              updateCustomer(selectedCustomer)
            }}>Update</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

    </View>
  );
}
