import React, { useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as Contacts from 'expo-contacts';
import { useAuth } from '../../hooks';
import {
  useCustomersData,
  useGetCustomersList,
  useTotalTransactionData,
} from '../../apis/useApi';
import { TwoCards } from '../Components/TwoCards';
import { TabNavigator } from '../Components/TabNavigator';
import FloatingButtons from '../Components/FloatingButton';
import { getItem, setItem, useAuthCompanyStore } from '../../core/utils';
import { create } from 'zustand';

// Create Zustand stores
export const useContactsStore = create((set) => ({
  contactsList: [],
  setContacts: (newState) => set({ contactsList: newState }),
}));

export const useCustomersStore = create((set) => ({
  customersList: [],
  setCustomers: (newState) => set({ customersList: newState }),
}));

const Index = ({ navigation }) => {
  const auth = useAuth.use.token(); // Destructure the token directly
  const company = useAuthCompanyStore((state) => state.selectedCompany);

  // Use object destructuring for more concise code
  const {
    mutate: cardRequest,
    data: cardData,
    isLoading: isCardLoading,
  } = useTotalTransactionData();
  const { mutate: customerRequest } = useCustomersData();
  const {
    mutate: getCustomerRequest,
    data: customersListData,
    isLoading: isCustomerLoading,
  } = useGetCustomersList();

  // Load customer data and card totals
  const loadCustomerData = useCallback(() => {
    if (company && auth?.user) {
      const customerFormData = new FormData();
      customerFormData.append('cost_center_id', auth.user.cost_center_id);
      customerFormData.append('company_id', company?.id);
      customerFormData.append('user_id', auth.user.id);
      customerRequest(customerFormData);
    }
  }, [auth.user, company, customerRequest]);

  const getCardTotals = useCallback(() => {
    if (company && auth?.user) {
      const formData = new FormData();
      formData.append('company_id', company?.id);
      formData.append('cost_center_id', auth.user.cost_center_id);
      formData.append('user_id', auth.user.id);
      cardRequest(formData);
    }
  }, [auth.user, company, cardRequest]);

  // Load contacts from device and update Zustand store
  const loadContactsFromDevice = async () => {
    const { status: contactStatus } = await Contacts.requestPermissionsAsync();

    if (contactStatus === 'granted' && customersListData?.data) {
      try {
        const { data: contactsArray } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        const filteredContacts = customersListData.data.map((obj) => ({
          id: obj.id,
          name: obj.name,
          digits: obj.phone,
          contactType: 'person',
          phoneNumbers: obj.phone ? [{ digits: obj.phone }] : [],
          imageAvailable: false,
        }));

        const newArray = contactsArray.filter((obj) =>
          obj.hasOwnProperty('phoneNumbers'),
        );

        useContactsStore.setState({
          contactsList: [...filteredContacts, ...newArray],
        });
      } catch (error) {
        console.error(error);
        // Handle error gracefully if needed
      }
    }
  };

  // Use useFocusEffect to handle component focus
  useFocusEffect(
    useCallback(() => {
      getCardTotals();
      loadCustomerData();
      getCustomerRequest({
        company_id: company?.id,
        cost_center_id: auth.user.cost_center_id,
      });
    }, [
      auth.user,
      company,
      getCardTotals,
      loadCustomerData,
      getCustomerRequest,
    ]),
  );

  // useEffect to load contacts when customer data is loaded
  useEffect(() => {
    if (!isCustomerLoading) {
      loadContactsFromDevice();
    }
  }, [isCustomerLoading]);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar animated={true} />
      {!isCardLoading && (
        <TwoCards
          toPay={cardData?.data?.toPay}
          toReceive={cardData?.data?.toReceive}
        />
      )}
      <View style={{ flex: 1 }}>
        <TabNavigator />
      </View>
      <FloatingButtons navigation={navigation} />
    </View>
  );
};

export default Index;
