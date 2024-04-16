import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { TabNavigator } from './tab-navigator';
import { useTotalTransactionData, useUserTodayTransactionsTotal } from '../../apis/use-api';
import { useAuthStore } from '../../hooks/auth-store';
import { useAuthCompanyStore, useCardAmountStore } from '../../hooks/zustand-store';
import { DetailCards, FloatingButtons } from '../components';

const Header = React.memo(() => {
  const { user: auth } = useAuthStore();
  const { selectedCompany: company } = useAuthCompanyStore();
  const { setCardAmount, cardAmount } = useCardAmountStore();
  const { data: cardTotal } = useUserTodayTransactionsTotal(auth?.user?.mobile);
  const {
    mutate: cardRequest,
    data: cardData,
    isLoading: isCardLoading,
  } = useTotalTransactionData();

  // Load customer data and card totals
  const loadCustomerData = useCallback(() => {
    if (company && auth?.user) {
      const cardForm = new FormData();
      cardForm.append('company_id', company?.id);
      cardForm.append('cost_center_id', auth.user.cost_center_id);
      cardForm.append('user_id', auth.user.id);
      cardRequest(cardForm);
    }
  }, [auth.user, cardRequest, company]);

  useEffect(() => {
    if (company) {
      if (cardData?.data) {
        setCardAmount({
          toReceive: cardData?.data?.toReceive,
          toPay: cardData?.data?.toPay,
        });
      }
    } else {
      if (cardTotal?.data) {
        setCardAmount({
          toReceive: cardTotal?.data?.toReceive,
          toPay: cardTotal?.data?.toPay,
        });
      }
    }
  }, [cardData, cardTotal, company, setCardAmount]);

  // Use useFocusEffect to handle component focus
  useFocusEffect(
    useCallback(() => {
      if (company?.id) {
        loadCustomerData();
      }
    }, [company?.id, loadCustomerData])
  );

  return (
    <DetailCards
      toPay={cardAmount?.toPay}
      toReceive={cardAmount?.toReceive}
      isCardLoading={isCardLoading}
    />
  );
});

const Index = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.container}>
        <TabNavigator />
      </View>
      <FloatingButtons navigation={navigation} />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
