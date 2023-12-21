import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useAuthCompanyStore = create(
  persist(
    (set) => ({
      selectedCompany: null,
      setCompany: (newCompany) => set({ selectedCompany: newCompany }),
    }),
    {
      name: 'auth-company-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useContactsStore = create((set) => ({
  contactsList: [],
  setContacts: (newContacts) => set({ contactsList: newContacts }),
}));

export const useCustomersStore = create((set) => ({
  customersList: [],
  setCustomers: (newCustomers) => set({ customersList: newCustomers }),
}));

export const useFilterToggleStore = create((set) => ({
  filterBy: 'none',
  toggleFilter: (newFilter) => set({ filterBy: newFilter }),
}));

export const useCardAmountStore = create((set) => ({
  cardAmount: {
    toReceive: 0,
    toPay: 0,
  },
  setCardAmount: (newCardAmount) => set({ cardAmount: newCardAmount }),
}));
