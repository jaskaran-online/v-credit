// useApi.js
import { useQuery, useMutation } from '@tanstack/react-query';
import { get, post, put, patch, del } from './api';

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

export const usePaymentApi = () => {
    return useMutation((data) => post('api/v1/transactions', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }));
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
