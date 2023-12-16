// useApi.js
import { useMutation, useQuery } from '@tanstack/react-query';

import { del, get, patch, post, put } from './api';

export const useCompanyProductsData = (url) => {
  return useQuery(['getData', url], () => get(url));
};

export const useCompanyCostCenterData = (url) => {
  return useQuery(['getCostCenters', url], () => get(url));
};

export const useItemsData = () => {
  return useQuery(['getItems'], () => get('api/v1/get/items/company/13/cost-center/13'));
};

export const useCustomerTransactionData = () => {
  return useMutation({
    mutationKey: 'getCustomerTransactionData',
    mutationFn: (data) => post('api/v1/get/customer/transactions?page=' + data.page, data),
    cacheTime: 500,
  });
};

export const useCustomersData = () => {
  return useMutation({
    mutationKey: 'getCustomerData',
    mutationFn: (data) => post('api/v1/get/customer/list', data),
    cacheTime: 500,
  });
};
export const useGetCustomersList = () => {
  return useMutation({
    mutationKey: 'getCustomersList',
    mutationFn: ({ company_id, cost_center_id }) =>
      get(`/api/v1/get/customer/${company_id}/${cost_center_id}`),
    cacheTime: 500,
  });
};

export const useUpdateCustomer = () => {
  return useMutation({
    mutationKey: 'updateCustomer',
    mutationFn: ({ id, title, description }) => {
      return post(`/api/v1/update/customer/${id}`, { id, title, description });
    },
    cacheTime: 500,
  });
};

export const useCreateCustomer = () => {
  return useMutation({
    mutationKey: 'createCustomer',
    mutationFn: ({ title, description, company_id, cost_center_id, user_id }) => {
      return post(`/api/v1/create/customer`, {
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
    mutationFn: (data) => post('api/v1/get/today/transactions?page=' + data.page, data),
    cacheTime: 500,
  });
};

export const useTransactionsDelete = () => {
  return useMutation({
    mutationKey: 'deleteTransaction',
    mutationFn: (data) => {
      return post('api/v1/delete/transaction', data);
    },
  });
};

export const useAuthLogin = () => {
  return useMutation((data) => post('api/v1/auth/login', data));
};

export const useTotalTransactionData = () => {
  return useMutation({
    mutationKey: 'getCustomerTotalData',
    mutationFn: (data) => post('api/v1/get/today/transactions/total', data),
    cacheTime: 500,
  });
};

export const useDailyBook = () => {
  return useMutation({
    mutationKey: 'dailyBook',
    mutationFn: (data) => post('api/v1/daily-book', data),
    cacheTime: 500,
  });
};

export const usePartyStatement = () => {
  return useMutation({
    mutationKey: 'partyStatement',
    mutationFn: (data) => post('api/v1/party-statement', data),
    cacheTime: 500,
  });
};

export const useAllParties = () => {
  return useMutation({
    mutationKey: 'allParties',
    mutationFn: (data) => post('api/v1/all-parties', data),
    cacheTime: 500,
  });
};

export const useAllTransactions = () => {
  return useMutation({
    mutationKey: 'allTransactionsReport',
    mutationFn: (data) => post('api/v1/all-transactions', data),
    cacheTime: 500,
  });
};

export const useCostCenterProfitReport = () => {
  return useMutation({
    mutationKey: 'costCenterProfitReport',
    mutationFn: (data) => post('api/v1/cost-center-profit', data),
    cacheTime: 500,
  });
};

export const useProductsApi = () => {
  return useMutation({
    mutationKey: 'productsApi',
    mutationFn: (data) => post('api/v1/products', data),
    cacheTime: 500,
  });
};

export const usePaymentApi = () => {
  return useMutation({
    mutationKey: 'payment',
    mutationFn: (data) => post('api/v1/transactions', data),
  });
};

export const useEditPaymentApi = () => {
  return useMutation({
    mutationKey: 'editPayment',
    mutationFn: (data) => post('api/v1/get/transaction-by-id', data),
  });
};

export const useUpdatePaymentApi = () => {
  return useMutation({
    mutationKey: 'updatePayment',
    mutationFn: (data) => post('api/v1/update/transactions', data),
  });
};

export const useVerifyUserAuthApi = () => {
  return useMutation({
    mutationKey: 'verifyUserAuth',
    mutationFn: (data) => post('api/v1/check-if-active', data),
  });
};

export const useCreatePurchaseApi = () => {
  return useMutation({
    mutationKey: 'createPurchase',
    mutationFn: (data) => post('api/v1/purchase/create', data),
  });
};

export const useCreateBalanceApi = () => {
  return useMutation({
    mutationKey: 'createBalance',
    mutationFn: (data) => post('api/v1/balance/create', data),
  });
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
