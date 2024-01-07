import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import { TabNavigator } from './tab-navigator';
import { useGetCustomersList, useTotalTransactionData } from '../../apis/use-api';
import { useAuthStore } from '../../hooks/auth-store';
import { useAuthCompanyStore, useCardAmountStore, useContactsStore } from '../../hooks/zustand-store';
import { loadContacts } from '../../service/contactService';
import { DetailCards, FloatingButtons } from '../components';

const  Header = React.memo(() => {
  const { user: auth } = useAuthStore();
  const { selectedCompany: company } = useAuthCompanyStore();
  const { setCardAmount, cardAmount } = useCardAmountStore();

  // Load customer data and card totals
  const loadCustomerData = useCallback(() => {
    if (company && auth?.user) {
      const cardForm = new FormData();
      cardForm.append('company_id', company?.id);
      cardForm.append('cost_center_id', auth.user.cost_center_id);
      cardForm.append('user_id', auth.user.id);
      cardRequest(cardForm);
    }
  }, [auth?.user, cardRequest, company]);

  const {
    mutate: cardRequest,
    data: cardData,
    isLoading: isCardLoading
  } = useTotalTransactionData();

  useEffect(() => {
    if (cardData?.data) {
      setCardAmount({
        toReceive: cardData?.data?.toReceive,
        toPay: cardData?.data?.toPay
      });
    }
  }, [cardData, setCardAmount]);

  // Use useFocusEffect to handle component focus
  useFocusEffect(
    useCallback(() => {
      loadCustomerData();
    }, [loadCustomerData])
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

  const [userContacts, setUserContacts] = useState([]);
  const contactsList = useContactsStore((state) => state.contactsList);
  const setContacts = useContactsStore((state) => state.setContacts);

  const { selectedCompany: company } = useAuthCompanyStore((state) => state);
  const { user: auth } = useAuthStore();

  const { mutate: getCustomerRequest, data: apiCustomersList } = useGetCustomersList();

  useEffect(() => {
    // Fetch customers if company and user details are available
    if (company?.id && auth.user?.cost_center_id) {
      getCustomerRequest({
        company_id: company.id,
        cost_center_id: auth.user.cost_center_id
      });
    }

    // Handle API customers list update
    if (apiCustomersList?.data) {
      const newContacts = apiCustomersList.data.map((obj) => ({
        id: obj.id,
        name: obj.name,
        digits: obj.phone,
        contactType: 'person',
        phoneNumbers: obj.phone ? [{ digits: obj.phone }] : [],
        imageAvailable: false
      }));
      setUserContacts((prevContacts) => [...newContacts, ...prevContacts]);
    }
  }, [company, auth.user, getCustomerRequest, apiCustomersList]);

  useEffect(() => {
    if (userContacts.length > 0) {
      setContacts(userContacts);
    } else {
      const fetchContacts = async () => {
        try {
          const existingContacts = await loadContacts();
          const contactsOnlyWithPhoneNumbers = existingContacts.filter((obj) =>
            obj.hasOwnProperty('phoneNumbers')
          );
          setUserContacts(contactsOnlyWithPhoneNumbers);
        } catch (error) {
          console.error('Failed to load contacts:', error);
        }
      };
      fetchContacts();
    }
  }, [userContacts]);


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
