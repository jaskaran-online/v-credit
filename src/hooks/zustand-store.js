import { create } from 'zustand';

/* The code is creating multiple custom hooks using the `create` function from the `zustand` library.
Each custom hook represents a separate store with its own state and setter function. */

export const useAuthCompanyStore = create((set) => ({
  selectedCompany: null,
  setCompany: (newCompany) => set({ selectedCompany: newCompany }),
}));

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
