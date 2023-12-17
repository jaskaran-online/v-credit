import * as Contacts from 'expo-contacts';
import { useEffect } from 'react';

import { useContactsStore } from './zustand-store';

const useLoadContacts = (customersListData, isCustomerLoading) => {
  useEffect(() => {
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

          const newArray = contactsArray.filter((obj) => obj.hasOwnProperty('phoneNumbers'));

          useContactsStore.setState({
            contactsList: [...filteredContacts, ...newArray],
          });
        } catch (error) {
          console.error(error);
          // Handle error gracefully if needed
        }
      }
    };
    if (!isCustomerLoading) {
      loadContactsFromDevice().then(() => null);
    }
  }, [customersListData.data, isCustomerLoading]);

  return [useContactsStore.getState().contactsList];
};

export default useLoadContacts;
