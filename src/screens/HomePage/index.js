import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { useCustomersData, useTotalTransactionData } from '../../apis/useApi';
import { useAuth } from '../../hooks';
import FloatingButtons from '../Components/FloatingButton';
import { TabNavigator } from '../Components/TabNavigator';
import { TwoCards } from '../Components/TwoCards';
import * as Contacts from 'expo-contacts';
import { getItem, setItem } from '../../core/utils';
import { create } from 'zustand';

// Create a Zustand store
export const useContactsStore = create((set) => ({
  contactsList: [],
  setContacts: (newState) => set((state) => ({ contactsList: newState })),
}));

export default function Index({ navigation }) {
  const auth = useAuth.use?.token();
  const setContacts = useContactsStore((state) => state.setContacts);

  const { mutate: cardRequest, data: cardData } = useTotalTransactionData();
  const {
    mutate: customerRequest,
    data: customerData,
    isLoading: isLoadingCustomer,
  } = useCustomersData();

  function loadCustomerData() {
    const customerFormData = new FormData();
    customerFormData.append('cost_center_id', auth?.user.cost_center_id);
    customerFormData.append('company_id', auth?.user.company_id);
    customerFormData.append('user_id', auth?.user.id);
    customerRequest(customerFormData);
  }

  const loadContactsFromDevice = async () => {
    const { status: contactStatus } = await Contacts.requestPermissionsAsync();
    if (contactStatus === 'granted') {
      let filteredContacts = customerData?.data
        ?.map((obj) => obj.customer)
        ?.map((obj) => {
          return {
            id: obj.phone_id,
            name: obj.name,
            digits: obj.phone,
            contactType: 'person',
            phoneNumbers: [{ digits: obj.phone }],
            imageAvailable: false,
          };
        });

      try {
        const localContacts = await getItem('contacts');
        if (localContacts) {
          const newArray = localContacts.filter((obj) =>
            obj.hasOwnProperty('phoneNumbers'),
          );
          setContacts([...filteredContacts, ...newArray]);
        } else {
          const { data: contactsArray } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
          });
          if (contactsArray.length > 0) {
            const newArray = contactsArray.filter((obj) =>
              obj.hasOwnProperty('phoneNumbers'),
            );
            setContacts([...filteredContacts, ...newArray]);
            setItem('contacts', [...filteredContacts, ...newArray]).then(
              (r) => null,
            );
          }
        }
      } catch (error) {
        const { data: contactsArray } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
        });
        if (contactsArray.length > 0) {
          const newArray = contactsArray.filter((obj) =>
            obj.hasOwnProperty('phoneNumbers'),
          );
          setContacts([...filteredContacts, ...newArray]);
          setItem('contacts', [...filteredContacts, ...newArray]).then(
            (r) => null,
          );
        }
      }
    }
  };

  function makeApiCall() {
    const formData = new FormData();
    formData.append('company_id', auth.user.company_id);
    formData.append('cost_center_id', auth.user.cost_center_id);
    formData.append('user_id', auth.user.id);
    cardRequest(formData);
  }

  useFocusEffect(
    useCallback(() => {
      makeApiCall();
    }, []),
  );

  useEffect(() => {
    loadCustomerData();
  }, []);

  useEffect(() => {
    if (!isLoadingCustomer) {
      loadContactsFromDevice();
    }
  }, [isLoadingCustomer]);

  return (
    <View className='flex-1 bg-white'>
      <StatusBar animated={true} />
      <TwoCards
        toPay={cardData?.data?.toPay}
        toReceive={cardData?.data?.toReceive}
      />
      <View className={'flex-1'}>
        <TabNavigator />
      </View>
      <FloatingButtons navigation={navigation} />
    </View>
  );
}
