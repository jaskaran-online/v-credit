import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import {useCustomersData, useGetCustomersList, useTotalTransactionData} from '../../apis/useApi';
import { useAuth } from '../../hooks';
import FloatingButtons from '../Components/FloatingButton';
import { TabNavigator } from '../Components/TabNavigator';
import { TwoCards } from '../Components/TwoCards';
import * as Contacts from 'expo-contacts';
import { getItem, setItem } from '../../core/utils';
import { create } from 'zustand';
import {useAuthCompanyStore} from "../../navigations/drawer-navigator";

// Create a Zustand store
export const useContactsStore = create((set) => ({
  contactsList: [],
  setContacts: (newState) => set((state) => ({ contactsList: newState })),
}));

export const useCustomersStore = create((set) => ({
  customersList: [],
  setCustomers: (newState) => set((state) => ({ customersList: newState })),
}));

export default function Index({ navigation }) {
  const auth = useAuth.use?.token();
  const setContacts = useContactsStore((state) => state.setContacts);
  const setCustomers = useCustomersStore((state) => state.setCustomers);
  const { mutate: cardRequest, data: cardData } = useTotalTransactionData();
  const company = useAuthCompanyStore((state) => state.selectedCompany);

  const {
    mutate: customerRequest,
    data: customerData,
    isLoading: isLoadingCustomer,
  } = useCustomersData();

  const {
    mutate: getCustomerRequest,
    data: customersList,
    isLoading: isCustomerLoading,
  } = useGetCustomersList();

  function loadCustomerData() {
    const customerFormData = new FormData();
    customerFormData.append('cost_center_id', auth?.user.cost_center_id);
    customerFormData.append('company_id', company?.id);
    customerFormData.append('user_id', auth?.user.id);
    customerRequest(customerFormData);
  }

  const loadContactsFromDevice = async () => {
    const { status: contactStatus } = await Contacts.requestPermissionsAsync();
    let filteredContacts = customersList?.data
      // ?.map((obj) => obj.customer)
      ?.map((obj) => {
        return {
          id: obj?.id,
          name: obj.name,
          digits: obj.phone,
          contactType: 'person',
          phoneNumbers: [{ digits: obj.phone }],
          imageAvailable: false,
        };
      });
    setCustomers(filteredContacts);
    if (contactStatus === 'granted') {
      setContacts(filteredContacts);
      try {
        const { data: contactsArray } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
        });
        if (contactsArray.length > 0) {
          const newArray = contactsArray.filter((obj) =>
            obj.hasOwnProperty('phoneNumbers'),
          );
          setContacts([...filteredContacts, ...newArray]);
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
        }
      }
    } else {
      setContacts(filteredContacts);
    }
  };

  function makeApiCall() {
    const formData = new FormData();
    formData.append('company_id', company?.id);
    formData.append('cost_center_id', auth.user.cost_center_id);
    formData.append('user_id', auth.user.id);
    cardRequest(formData);
  }

  useFocusEffect(
    useCallback(() => {
      makeApiCall();
      loadCustomerData();

      getCustomerRequest({
        company_id: company?.id,
        cost_center_id: auth.user.cost_center_id
      });

    }, [company]),
  );

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
