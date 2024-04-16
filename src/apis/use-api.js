// use-api.js
import { useMutation, useQuery } from '@tanstack/react-query';

import { del, get, patch, post, put } from './api';

export const useCompanyProductsData = (url) => {
  return useQuery(['getData', url], () => get(url));
};

export const useCompanyCostCenterData = (url) => {
  return useQuery(['getCostCenters', url], () => get(url));
};

export const useItemsData = () => {
  return useQuery(['getItems'], () => get('get/items/company/13/cost-center/13'));
};

export const useCustomerTransactionData = () => {
  return useMutation({
    mutationKey: 'getCustomerTransactionData',
    mutationFn: ({ formData, page }) => post('get/customer/transactions?page=' + page, formData),
    cacheTime: 1000,
    staleTime: 2000,
  });
};

export const useCustomersData = () => {
  return useMutation({
    mutationKey: 'getCustomerData',
    mutationFn: (data) => post('get/customer/list', data),
    cacheTime: 500,
    staleTime: 2000,
  });
};
export const useGetCustomersList = () => {
  return useMutation({
    mutationKey: ['getCustomersList'],
    mutationFn: ({ company_id, cost_center_id }) =>
      get(`get/customer/${company_id}/${cost_center_id}`),
    cacheTime: 1500,
    staleTime: 2000,
  });
};

export const useGetUserCustomersList = (userId) => {
  return useQuery(
    ['getUserCustomersList', userId],
    () => get(`get/user/customers-list/${userId}`),
    {
      cacheTime: 1500,
      staleTime: 2000,
      enabled: Boolean(userId),
    }
  );
};

export const useUpdateCustomer = () => {
  return useMutation({
    mutationKey: 'updateCustomer',
    mutationFn: ({ id, title, description, isAccountShared }) => {
      return post(`update/customer/${id}`, { id, title, description, isAccountShared });
    },
    cacheTime: 500,
  });
};

export const useCreateCustomer = () => {
  return useMutation({
    mutationKey: 'createCustomer',
    mutationFn: ({ title, description, company_id, cost_center_id, user_id }) => {
      return post(`create/customer`, {
        title,
        description,
        company_id,
        cost_center_id,
        user_id,
      });
    },
    cacheTime: 500,
  });
};

export const useTransactionsData = () => {
  return useMutation({
    mutationKey: 'totalAmount',
    mutationFn: ({ formData, page }) => {
      return post('get/today/transactions?page=' + page, formData);
    },
    cacheTime: 500,
  });
};

export const useTransactionsDelete = () => {
  return useMutation({
    mutationKey: 'deleteTransaction',
    mutationFn: (data) => {
      return post('delete/transaction', data);
    },
  });
};

export const useAuthLogin = () => {
  return useMutation((data) => post('auth/login', data));
};

export const useTotalTransactionData = () => {
  return useMutation({
    mutationKey: 'getCustomerTotalData',
    mutationFn: (data) => post('get/today/transactions/total', data),
    cacheTime: 500,
  });
};

export const useCreateUserTransaction = () => {
  return useMutation({
    mutationKey: 'createUserTransaction',
    mutationFn: (data) => post('create/user/transaction', data),
  });
};

/**
 * A hook to utilize for handling daily book mutations.
 *
 * @return {object} The mutation hook object.
 */
export const useDailyBook = () => {
  return useMutation({
    mutationKey: 'dailyBook',
    mutationFn: (data) => post('daily-book', data),
    cacheTime: 500,
  });
};

/**
 * Generate a party statement mutation hook.
 *
 * @return {Object} The party statement mutation hook.
 */
export const usePartyStatement = () => {
  return useMutation({
    mutationKey: 'partyStatement',
    mutationFn: (data) => post('party-statement', data),
    cacheTime: 500,
  });
};

/**
 * A custom hook to fetch all parties using a mutation.
 *
 * @return {Object} The mutation object for fetching all parties.
 */
export const useAllParties = () => {
  return useMutation({
    mutationKey: 'allParties',
    mutationFn: (data) => post('all-parties', data),
    cacheTime: 500,
  });
};

export const useAllTransactions = () => {
  return useMutation({
    mutationKey: 'allTransactionsReport',
    mutationFn: (data) => post('all-transactions', data),
    cacheTime: 500,
  });
};

export const useCostCenterProfitReport = () => {
  return useMutation({
    mutationKey: 'costCenterProfitReport',
    mutationFn: (data) => post('cost-center-profit', data),
    cacheTime: 500,
  });
};

export const useProductsApi = () => {
  return useMutation({
    mutationKey: 'productsApi',
    mutationFn: (data) => post('products', data),
    cacheTime: 500,
  });
};

export const usePaymentApi = () => {
  return useMutation({
    mutationKey: 'payment',
    mutationFn: (data) => post('transactions', data),
  });
};

export const useEditPaymentApi = () => {
  return useMutation({
    mutationKey: 'editPayment',
    mutationFn: (data) => post('get/transaction-by-id', data),
  });
};

export const useUpdatePaymentApi = () => {
  return useMutation({
    mutationKey: 'updatePayment',
    mutationFn: (data) => post('update/transactions', data),
  });
};

export const useVerifyUserAuthApi = () => {
  return useMutation({
    mutationKey: 'verifyUserAuth',
    mutationFn: (data) => post('check-if-active', data),
  });
};

export const useCreatePurchaseApi = () => {
  return useMutation({
    mutationKey: 'createPurchase',
    mutationFn: (data) => post('purchase/create', data),
  });
};

export const useCreateBalanceApi = () => {
  return useMutation({
    mutationKey: 'createBalance',
    mutationFn: (data) => post('balance/create', data),
  });
};
export const useRegisterUser = () => {
  return useMutation({
    mutationKey: 'registerUser',
    mutationFn: (data) => post('user/register', data),
  });
};

export const useOTPVerify = () => {
  return useMutation({
    mutationKey: 'otpVerify',
    mutationFn: (data) => post('verify-otp', data),
  });
};

// Define the React Query hook
export const useCustomerTransactions = (customerId, userId) => {
  return useQuery(
    ['userTransactions', customerId],
    () => get(`get/user/transactions?customer_id=${customerId}&user_id=${userId}`),
    {
      enabled:
        customerId !== undefined &&
        customerId !== '' &&
        customerId !== null &&
        userId !== undefined &&
        userId !== '' &&
        userId !== null,
    }
  );
};

export const useUserCustomerList = (mobile) => {
  if (mobile === undefined || mobile === '' || mobile === null) {
    return {
      isLoading: false,
      data: null,
    };
  } else {
    return useQuery(
      ['userCustomerList', mobile],
      () => get(`get/user/customer/list?mobile=${mobile}`),
      {
        enabled: mobile !== null,
      }
    );
  }
};

export const useUserTodayTransactions = (mobile) => {
  return useQuery(
    ['userTodayTransactions', mobile],
    () => get(`get/user/today/transactions?mobile=${mobile}`),
    {
      enabled: mobile !== undefined && mobile !== '' && mobile !== null,
    }
  );
};

export const useBackupList = (companyID) => {
  return useQuery(['useBackupList', companyID], () => get(`get/backups/?company_id=${companyID}`), {
    staleTime: 5000,
  });
};

export const useBackupGenerate = () => {
  return useMutation(['useBackupListGenerate'], (postData) => post(`download/excel`, postData));
};

export const useUserTodayTransactionsTotal = (mobile) => {
  return useQuery(
    ['userTodayTransactionsTotal', mobile],
    () => get(`get/user/today/transactions/total?mobile=${mobile}`),
    {
      enabled: mobile !== undefined && mobile !== '' && mobile !== null,
    }
  );
};

export const usePutData = () => {
  return useMutation((data) => put('your-put-url', data));
};

export const usePatchData = () => {
  return useMutation((data) => patch('your-patch-url', data));
};

export const useDeleteData = () => {
  return useMutation((url) => del(url));
};
