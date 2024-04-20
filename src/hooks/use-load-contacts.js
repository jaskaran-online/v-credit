import { useEffect } from 'react';

import { useContactsStore } from './zustand-store';

const useLoadContacts = (customersListData, isCustomerLoading) => {
  const { contactsList: existingContacts, setContacts } = useContactsStore();
  let contacts = [];
  useEffect(() => {
    if (customersListData?.data && !isCustomerLoading) {
      try {
        const contactsOnlyWithPhoneNumbers = existingContacts.filter((obj) =>
          obj.hasOwnProperty('phoneNumbers')
        );

        const serverContacts = customersListData.data.map((obj) => ({
          id: obj.id,
          name: obj.name,
          digits: obj.phone,
          contactType: 'person',
          phoneNumbers: obj.phone ? [{ digits: obj.phone, number: obj.phone }] : [],
          imageAvailable: false,
        }));

        contacts = [...serverContacts, ...contactsOnlyWithPhoneNumbers];
        setContacts(contacts);
      } catch (error) {
        console.error(error);
        // Handle error gracefully if needed
      }
    }
  }, [customersListData, isCustomerLoading]);

  return contacts;
};

export default useLoadContacts;
