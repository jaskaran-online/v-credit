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
  useVerifyUserAuthApi,
} from '../../apis/useApi';
import { TwoCards } from '../Components/TwoCards';
import { TabNavigator } from '../Components/TabNavigator';
import FloatingButtons from '../Components/FloatingButton';
import {
  useAuthCompanyStore,
  useCardAmountStore,
  useContactsStore,
} from '../../core/utils';

const Index = ({ navigation }) => {
  const auth = useAuth.use.token(); // Destructure the token directly
  const signOut = useAuth?.use?.signOut();

  const company = useAuthCompanyStore((state) => state.selectedCompany);
  let cardAmount = useCardAmountStore((state) => state.cardAmount);
  let setCardAmount = useCardAmountStore((state) => state.setCardAmount);

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

  const {
    mutate: verifyUser,
    isError: isVerifyUserError,
    isLoading: isVerifyUserLoading,
  } = useVerifyUserAuthApi();

  useEffect(() => {
    if (auth?.user) {
      verifyUser({
        id: auth.user.id,
      });
    }
  }, []);

  useEffect(() => {
    if (!isVerifyUserLoading) {
      if (isVerifyUserError) {
        signOut();
      }
    }
  }, [isVerifyUserLoading]);

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
      loadContactsFromDevice().then((r) => null);
    }
  }, [isCustomerLoading]);

  useEffect(() => {
    if (cardData?.data) {
      setCardAmount({
        toReceive: cardData?.data?.toReceive,
        toPay: cardData?.data?.toPay,
      });
    }
  }, [cardData, isCardLoading]);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar animated={true} />
      <TwoCards
        toPay={cardAmount?.toPay}
        toReceive={cardAmount?.toReceive}
        homePage={true}
      />
      <View style={{ flex: 1 }}>
        <TabNavigator />
      </View>
      <FloatingButtons navigation={navigation} />
    </View>
  );
};

export default Index;
