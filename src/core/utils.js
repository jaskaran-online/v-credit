// import * as SecureStore from 'expo-secure-store';
import createSecureStore from '@neverdull-agency/expo-unlimited-secure-store';
import { Linking } from 'react-native';
import { showMessage } from 'react-native-flash-message';

const SecureStore = createSecureStore();

const TOKEN = 'token';
export const getToken = () => getItem(TOKEN);
export const removeToken = () => removeItem(TOKEN);
export const setToken = (value) => setItem(TOKEN, value);
export const setUser = (value) => setItem('user', value);

/**
 * Retrieves an item from the SecureStore given a key.
 *
 * @param {string} key - The key to identify the item.
 * @return {Promise<any>} Returns a Promise that resolves to the item value, or null if the item does not exist.
 */
export async function getItem(key) {
  const value = await SecureStore.getItem(key);
  return value ? JSON.parse(value) : null;
}

/**
 * Sets a key-value pair in SecureStore.
 *
 * @param {string} key - The key to set in SecureStore.
 * @param {any} value - The value to set for the given key.
 * @return {Promise<void>} - A promise that resolves when the key-value pair is set in SecureStore.
 */
export async function setItem(key, value) {
  await SecureStore.setItem(key, JSON.stringify(value));
}

/**
 * Removes the item with the specified key from the SecureStore.
 *
 * @param {string} key - The key of the item to be removed.
 * @return {Promise<void>} A promise that resolves when the item has been successfully removed.
 */
export async function removeItem(key) {
  await SecureStore.removeItem(key);
}

/**
 * Opens a link in the default browser.
 *
 * @param {string} url - The URL to open in the browser.
 * @return {void} This function does not return anything.
 */
export function openLinkInBrowser(url) {
  Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url));
}

export const createSelectors = (_store) => {
  const store = _store;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    store.use[k] = () => store((s) => s[k]);
  }
  return store;
};

/**
 * Checks if the given date is today.
 *
 * @param {string} dateString - The date to check in string format.
 * @return {boolean} Returns true if the given date is today, otherwise false.
 */
export const isToday = (dateString) => {
  const currentDate = new Date();
  const inputDate = new Date(dateString);

  return (
    currentDate.getFullYear() === inputDate.getFullYear() &&
    currentDate.getMonth() === inputDate.getMonth() &&
    currentDate.getDate() === inputDate.getDate()
  );
};

export function convertTimeToPM(timeStr) {
  // Convert the time string to a Date object.
  const time = new Date(timeStr);

  // Get the hour and minute.
  const hour = time.getHours();
  const minute = time.getMinutes();

  // Convert the hour to 12-hour format.
  let pmHour = hour;
  if (pmHour >= 12) {
    pmHour -= 12;
  }

  // Add leading zeros to hour and minute if needed.
  const formattedHour = pmHour.toString().padStart(2, '0');
  const formattedMinute = minute.toString().padStart(2, '0');

  // Add the AM/PM suffix.
  const suffix = pmHour >= 12 ? 'PM' : 'AM';

  // Return the formatted time string.
  return `${formattedHour}:${formattedMinute} ${suffix}`;
}

/**
 * Formats a given date for displaying in a message.
 *
 * @param {string|number|Date} inputDate - The date to be formatted. It can be a string, number, or Date object.
 * @return {string} The formatted date in the format "ddth MonthName yyyy", where "dd" is the day with an ordinal suffix, "MonthName" is the full name of the month, and "yyyy" is the year.
 */
export function formatDateForMessage(inputDate) {
  const date = new Date(inputDate);

  // Function to get the ordinal suffix for the day (e.g., 1st, 2nd, 3rd, 4th, etc.)
  function getOrdinalSuffix(day) {
    if (day >= 11 && day <= 13) {
      return 'th';
    }
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  // Get day, month, and year from the Date object
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  // Array of month names to get the month's name from its index
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Format the date as "dd MMMM yyyy"
  return `${day}${getOrdinalSuffix(day)} ${monthNames[monthIndex]} ${year}`;
}

/**
 * Displays a toast message with the given message and type.
 *
 * @param {string} message - The message to display in the toast.
 * @param {string} type - The type of toast to display ('success' or 'error').
 * @return {void}
 */
export const showToast = (message = '', type = 'success', position = 'bottom') => {
  showMessage({
    message,
    type,
    icon: type,
    position,
    animated: true,
  });
};

/**
 * Processes a string by removing "-", ",", and spaces from it. If the resulting string has a length greater than 10, it removes the first three letters.
 *
 * @param {null} str - The input string to be processed.
 * @return {string} The processed string.
 */
export const processString = (str = null) => {
  if (str === null || str === '') return '';

  const processedString = str.replace(/[-,\s]/g, '');
  const [, , ...remainingLetters] = processedString;

  return remainingLetters.length > 11 ? remainingLetters.join('') : processedString;
};

/**
 * Converts a given date string to the format "YYYY-MM-DD HH:MM:SS".
 *
 * @param {string} dateString - The date string to be converted.
 * @return {string} The converted date string in the format "YYYY-MM-DD HH:MM:SS".
 */
export const convertDateFormat = (dateString) => {
  const dateObj = new Date(dateString);

  const convertedDate = dateObj.toISOString().slice(0, 10).replace('T', ' ');
  const convertedTime = dateObj.toISOString().slice(11, 19);

  return `${convertedDate} ${convertedTime}`;
};
