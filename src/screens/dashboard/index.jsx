import { useFocusEffect } from '@react-navigation/native';
import * as Contacts from 'expo-contacts';
import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';

import { TabNavigator } from './tab-navigator';
import {
  useCustomersData,
  useGetCustomersList,
  useTotalTransactionData,
  useVerifyUserAuthApi,
} from '../../apis/use-api';
import { useAuth } from '../../hooks';
import useLoadContacts from '../../hooks/use-load-contacts';
import { useAuthCompanyStore, useCardAmountStore } from '../../hooks/zustand-store';
import { FloatingButtons, DetailCards } from '../components';

const Index = ({ navigation }) => {
  const auth = useAuth.use.token(); // Destructure the token directly
  const signOut = useAuth?.use?.signOut();

  const company = useAuthCompanyStore((state) => state.selectedCompany);
  const cardAmount = useCardAmountStore((state) => state.cardAmount);
  const setCardAmount = useCardAmountStore((state) => state.setCardAmount);

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

  // Load contacts from device
  useLoadContacts(customersListData, isCustomerLoading);

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

  // Use useFocusEffect to handle component focus
  useFocusEffect(
    useCallback(() => {
      getCardTotals();
      loadCustomerData();
      getCustomerRequest({
        company_id: company?.id,
        cost_center_id: auth.user.cost_center_id,
      });
    }, [auth.user, company, getCardTotals, loadCustomerData, getCustomerRequest]),
  );

  useEffect(() => {
    if (cardData?.data) {
      setCardAmount({
        toReceive: cardData?.data?.toReceive,
        toPay: cardData?.data?.toPay,
      });
    }
  }, [cardData, isCardLoading]);

  return (
    <View className="flex-1">
      <DetailCards toPay={cardAmount?.toPay} toReceive={cardAmount?.toReceive} homePage />
      <View className="flex-1">
        <TabNavigator />
      </View>
      <FloatingButtons navigation={navigation} />
    </View>
  );
};

export default Index;
