import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://mycreditbook.com/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
    }
});

// Function to make GET requests
export const get = async (url) => {
    try {
        const response = await instance.get(url);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
};

// Function to make POST requests
export const post = async (url, data, headers) => {

    try {

        const response = await instance.post(url, data, headers);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error(error)
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
        const response = await instance.put(url, data);
        return response.data;
    } catch (error) {
        throw new Error('Network response was not ok');
    }
};

// Function to make PATCH requests
export const patch = async (url, data) => {
    try {
        const response = await instance.patch(url, data);
        return response.data;
    } catch (error) {
        throw new Error('Network response was not ok');
    }
};

// Function to make DELETE requests
export const del = async (url) => {
    try {
        await instance.delete(url);
    } catch (error) {
        throw new Error('Network response was not ok');
    }
};

// ...add more functions for other HTTP methods as needed
