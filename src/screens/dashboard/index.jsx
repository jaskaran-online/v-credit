import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { TabNavigator } from './tab-navigator';
import { useTotalTransactionData } from '../../apis/use-api';
import SkeletonPlaceholder from '../../components/skeleton-placeholder ';
import { useAuth } from '../../hooks';
import {
  useAuthCompanyStore,
  useCardAmountStore,
  useContactsStore,
} from '../../hooks/zustand-store';
import { loadContacts } from '../../service/contactService';
import { FloatingButtons, DetailCards } from '../components';

function Header() {
  const auth = useAuth.use.token();
  const { selectedCompany: company } = useAuthCompanyStore();
  const { setCardAmount, cardAmount } = useCardAmountStore();

  // Load customer data and card totals
  const loadCustomerData = () => {
    if (company && auth?.user) {
      const cardForm = new FormData();
      cardForm.append('company_id', company?.id);
      cardForm.append('cost_center_id', auth.user.cost_center_id);
      cardForm.append('user_id', auth.user.id);
      cardRequest(cardForm);
    }
    console.log('loadCustomerData');
  };

  const {
    mutate: cardRequest,
    data: cardData,
    isLoading: isCardLoading,
  } = useTotalTransactionData();

  useEffect(() => {
    if (cardData?.data) {
      setCardAmount({
        toReceive: cardData?.data?.toReceive,
        toPay: cardData?.data?.toPay,
      });
    }
  }, [cardData, setCardAmount]);

  // Use useFocusEffect to handle component focus
  useFocusEffect(
    useCallback(() => {
      loadCustomerData();
    }, [company])
  );

  if (isCardLoading) {
    return (
      <View className="flex-row items-center justify-between p-2 bg-white">
        <SkeletonPlaceholder borderRadius={10} height={80} width="49%" />
        <SkeletonPlaceholder borderRadius={10} height={80} width="49%" />
      </View>
    );
  }
  return <DetailCards toPay={cardAmount?.toPay} toReceive={cardAmount?.toReceive} />;
}

const Index = ({ navigation }) => {
  const { contactsList, setContacts } = useContactsStore();

  useEffect(() => {
    const fetchContacts = async () => {
      console.log('fetchContacts');
      try {
        const contacts = await loadContacts();
        setContacts(contacts);
      } catch (error) {
        console.error('Failed to load contacts:', error);
      }
    };
    if (contactsList.length === 0) {
      fetchContacts();
    }
  }, [setContacts, contactsList]);

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <View style={{ flex: 1 }}>
        <TabNavigator />
      </View>
      <FloatingButtons navigation={navigation} />
    </View>
  );
};

export default Index;
