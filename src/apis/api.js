import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://mycreditbook.com/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
    }
});

// Function to make GET requests
export const get = async (url) => {
    try {
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
};

// Function to make POST requests
export const post = async (url, data) => {
    try {
        const response = await axiosInstance.post(url, data);
        return response.data;
    } catch (error) {
        console.error(error)
        console.log(error.response.data.message)
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
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
