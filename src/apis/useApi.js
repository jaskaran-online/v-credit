// useApi.js
import {useQuery, useMutation, QueryClient} from '@tanstack/react-query';
import { get, post, put, patch, del } from './api';

const queryClient = new QueryClient();

export const useCompanyProductsData = (url) => {
    return useQuery(['getData', url], () => get(url));
};

export const useCustomerTransactionData = () => {
    return useMutation({
        mutationKey:  "getCustomerTransactionData",
        mutationFn: (data) => post('api/v1/get/customer/transactions', data),
        cacheTime : 500,
    });
};

export const useCustomersData = () => {
    return useMutation({
        mutationKey:  "getCustomerData",
        mutationFn: (data) => post('api/v1/get/customer/list', data),
        cacheTime : 500,
    });
};

export const useTransactionsData = () => {
    return useMutation({
        mutationKey : 'totalAmount',
        mutationFn : (data) => post('api/v1/get/today/transactions', data),
        cacheTime : 500
    });
};

export const useAuthLogin = () => {
    return useMutation((data) => post('api/v1/auth/login', data));
};

export const useTotalTransactionData = () => {
    return useMutation({
        mutationKey:  "getCustomerTotalData",
        mutationFn: (data) => post('api/v1/get/today/transactions/total', data),
        cacheTime : 500,
    });
};

export const useDailyBook = () => {
    return useMutation({
        mutationKey:  "dailyBook",
        mutationFn: (data) => post('api/v1/daily-book', data),
        cacheTime : 500,
    });
};

export const usePartyStatement = () => {
    return useMutation({
        mutationKey:  "partyStatement",
        mutationFn: (data) => post('api/v1/party-statement', data),
        cacheTime : 500,
    });
};

export const useAllParties = () => {
    return useMutation({
        mutationKey:  "allParties",
        mutationFn: (data) => post('api/v1/all-parties', data),
        cacheTime : 500,
    });
};

export const useAllTransactions = () => {
    return useMutation({
        mutationKey:  "allTransactionsReport",
        mutationFn: (data) => post('api/v1/all-transactions', data),
        cacheTime : 500,
    });
};

export const useCostCenterProfitReport = () => {
    return useMutation({
        mutationKey:  "costCenterProfitReport",
        mutationFn: (data) => post('api/v1/cost-center-profit', data),
        cacheTime : 500,
    });
};


export const useProductsApi = () => {
    return useMutation({
        mutationKey:  "productsApi",
        mutationFn: (data) => post('api/v1/products', data),
        cacheTime : 500,
    });
};

export const usePaymentApi = () => {
    return useMutation({
        mutationKey : "payment",
        mutationFn : (data) => post('api/v1/transactions', data)
    });
};

export const useEditPaymentApi = () => {
    return useMutation({
        mutationKey : "editPayment",
        mutationFn : (data) => post('api/v1/get/transaction-by-id', data)
    });
};

export const useUpdatePaymentApi = () => {
    return useMutation({
        mutationKey : "updatePayment",
        mutationFn : (data) => post('api/v1/update/transactions', data)
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
