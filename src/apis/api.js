import axios from 'axios';

import { ENV } from '../../env.config';

const BASE_URL = ENV.DEV.BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
  },
});

// Function to make GET requests
export const get = async (url, params) => {
  if (!params) params = {};

  // console.log('================GET API LOGS===================');
  // console.info({
  //   method: 'GET',
  //   baseUrl: BASE_URL,
  //   url,
  //   params,
  // });
  // console.log('====================================');

  try {
    const response = await axiosInstance.get(url, { params });
    return response.data;
  } catch (error) {
    console.error({
      method: 'GET',
      error: error.response.data,
      url,
    });
    throw new Error(error);
  }
};

// Function to make POST requests
export const post = async (url, data) => {
  try {
    // console.log('================POST API LOGS===================');
    // console.info({
    //   method: 'POST',
    //   baseUrl: BASE_URL,
    //   url,
    //   data,
    // });
    // console.log('====================================');
    const response = await axiosInstance.post(url, data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      // console.log('===================API ERROR=============================');
      // console.error({
      //   method: 'POST',
      //   error: error.response.data,
      //   url,
      // });
      // console.log('===============================================');

      throw new Error(error.response.data.message);
    } else {
      // console.log('================== NETWORK ERROR =============================');
      // console.error(error);
      // console.log('===============================================');
      throw new Error('An error occurred during the request.');
    }
  }
};

// Function to make PUT requests
export const put = async (url, data) => {
  try {
    const response = await axiosInstance.put(url, data);
    return response.data;
  } catch (error) {
    throw new Error('Network response was not ok');
  }
};

// Function to make PATCH requests
export const patch = async (url, data) => {
  try {
    const response = await axiosInstance.patch(url, data);
    return response.data;
  } catch (error) {
    throw new Error('Network response was not ok');
  }
};

// Function to make DELETE requests
export const del = async (url) => {
  try {
    await axiosInstance.delete(url);
  } catch (error) {
    throw new Error('Network response was not ok');
  }
};

// ...add more functions for other HTTP methods as needed
